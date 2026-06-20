"use client";

import {
  GoogleGenAI,
  Modality,
  type LiveServerMessage,
  type Session
} from "@google/genai";
import { createLiveSessionToken } from "@/lib/api";
import type { JournalEntry } from "@/lib/types";
import { decodeBase64ToPcm16, float32ToPcm16Base64, pcm16ToAudioBuffer } from "./audio";

export type VoiceSessionMessage = {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  final: boolean;
};

export type VoiceSessionState = "idle" | "connecting" | "connected" | "error";

type StartVoiceSessionOptions = {
  onStateChange: (state: VoiceSessionState) => void;
  onMessage: (message: VoiceSessionMessage) => void;
  onStatus: (status: string) => void;
  onEnded: () => void;
  recentEntries: JournalEntry[];
};

export type LiveSessionHandle = {
  stop: () => Promise<void>;
  sendText: (text: string) => void;
  isMuted: () => boolean;
  toggleMute: () => boolean;
};

function getMicrophoneError(error: unknown) {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError") {
      return "Microphone access was denied. Allow microphone access in your browser and try again.";
    }
    if (error.name === "NotFoundError") {
      return "No microphone was found on this device.";
    }
  }
  return error instanceof Error ? error.message : "Unable to start the voice session.";
}

export async function startVoiceSession(
  options: StartVoiceSessionOptions
): Promise<LiveSessionHandle> {
  options.onStateChange("connecting");
  options.onStatus("Preparing a secure live session…");

  let audioContext: AudioContext | null = null;
  let captureContext: AudioContext | null = null;
  let mediaStream: MediaStream | null = null;
  let source: MediaStreamAudioSourceNode | null = null;
  let processor: ScriptProcessorNode | null = null;
  let silentGain: GainNode | null = null;
  let session: Session | null = null;
  let muted = false;
  let closed = false;
  let failed = false;
  let playbackCursor = 0;
  const playbackNodes = new Set<AudioBufferSourceNode>();

  function stopPlayback() {
    for (const node of playbackNodes) {
      try {
        node.stop();
      } catch {
        // A node may already have ended.
      }
    }
    playbackNodes.clear();
    playbackCursor = audioContext?.currentTime ?? 0;
  }

  async function cleanup(closeSession: boolean) {
    if (closed) return;
    closed = true;
    stopPlayback();

    if (closeSession && session) {
      try {
        session.sendRealtimeInput({ audioStreamEnd: true });
      } catch {
        // The socket may already be closed.
      }
      session.close();
    }

    processor?.disconnect();
    source?.disconnect();
    silentGain?.disconnect();
    mediaStream?.getTracks().forEach((track) => track.stop());

    await Promise.allSettled([
      captureContext && captureContext.state !== "closed"
        ? captureContext.close()
        : Promise.resolve(),
      audioContext && audioContext.state !== "closed" ? audioContext.close() : Promise.resolve()
    ]);

    options.onEnded();
  }

  function enqueuePlayback(base64: string) {
    if (!audioContext || closed) return;
    const pcm16 = decodeBase64ToPcm16(base64);
    const buffer = pcm16ToAudioBuffer(audioContext, pcm16, 24000);
    const node = audioContext.createBufferSource();
    node.buffer = buffer;
    node.connect(audioContext.destination);
    node.onended = () => playbackNodes.delete(node);

    const startAt = Math.max(audioContext.currentTime, playbackCursor);
    node.start(startAt);
    playbackCursor = startAt + buffer.duration;
    playbackNodes.add(node);
  }

  function handleServerMessage(response: LiveServerMessage) {
    const content = response.serverContent;
    if (!content) return;

    if (content.interrupted) {
      stopPlayback();
      options.onStatus("Listening to you…");
    }

    for (const part of content.modelTurn?.parts ?? []) {
      if (part.inlineData?.data) enqueuePlayback(part.inlineData.data);
    }

    if (content.inputTranscription?.text) {
      options.onMessage({
        role: "user",
        text: content.inputTranscription.text,
        timestamp: new Date().toISOString(),
        final: Boolean(content.turnComplete)
      });
    }

    if (content.outputTranscription?.text) {
      options.onMessage({
        role: "assistant",
        text: content.outputTranscription.text,
        timestamp: new Date().toISOString(),
        final: Boolean(content.turnComplete)
      });
    }

    if (content.turnComplete) {
      options.onStatus("Listening…");
    } else if (content.modelTurn) {
      options.onStatus("Hesychia is responding…");
    }
  }

  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Voice mode is not supported by this browser.");
    }

    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    options.onStatus("Connecting to Gemini Live…");
    const { token } = await createLiveSessionToken({
      recentEntries: options.recentEntries.slice(0, 3)
    });
    const ai = new GoogleGenAI({ apiKey: token, apiVersion: "v1alpha" });

    audioContext = new AudioContext({ sampleRate: 24000 });
    captureContext = new AudioContext({ sampleRate: 16000 });
    source = captureContext.createMediaStreamSource(mediaStream);
    processor = captureContext.createScriptProcessor(2048, 1, 1);
    silentGain = captureContext.createGain();
    silentGain.gain.value = 0;

    session = await ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: [Modality.AUDIO],
        inputAudioTranscription: {},
        outputAudioTranscription: {}
      },
      callbacks: {
        onopen: () => {
          options.onStateChange("connected");
          options.onStatus("Listening…");
        },
        onmessage: handleServerMessage,
        onerror: (error) => {
          failed = true;
          options.onStateChange("error");
          options.onStatus(error.message || "The voice connection encountered an error.");
          void cleanup(true);
        },
        onclose: () => {
          if (!failed) {
            options.onStateChange("idle");
            options.onStatus("Voice session ended.");
          }
          void cleanup(false);
        }
      }
    });

    processor.onaudioprocess = (event) => {
      if (muted || closed || !session) return;
      const samples = event.inputBuffer.getChannelData(0);
      session.sendRealtimeInput({
        audio: {
          data: float32ToPcm16Base64(samples),
          mimeType: "audio/pcm;rate=16000"
        }
      });
    };

    source.connect(processor);
    processor.connect(silentGain);
    silentGain.connect(captureContext.destination);
    await Promise.all([audioContext.resume(), captureContext.resume()]);

    return {
      async stop() {
        options.onStateChange("idle");
        options.onStatus("Voice session ended.");
        await cleanup(true);
      },
      sendText(text: string) {
        if (closed || !session) return;
        session.sendRealtimeInput({ text });
      },
      isMuted() {
        return muted;
      },
      toggleMute() {
        muted = !muted;
        if (muted) {
          session?.sendRealtimeInput({ audioStreamEnd: true });
          options.onStatus("Microphone muted.");
        } else {
          options.onStatus("Listening…");
        }
        return muted;
      }
    };
  } catch (error) {
    options.onStateChange("error");
    options.onStatus(getMicrophoneError(error));
    await cleanup(true);
    throw error;
  }
}
