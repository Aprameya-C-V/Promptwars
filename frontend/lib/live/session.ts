"use client";

import { GoogleGenAI, Modality } from "@google/genai";
import { createLiveSessionToken } from "@/lib/api";
import { decodeBase64ToPcm16, float32ToPcm16Base64, pcm16ToAudioBuffer } from "./audio";

export type VoiceSessionMessage = {
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
};

export type VoiceSessionState = "idle" | "connecting" | "connected" | "error";

type StartVoiceSessionOptions = {
  onStateChange: (state: VoiceSessionState) => void;
  onMessage: (message: VoiceSessionMessage) => void;
  onStatus: (status: string) => void;
};

type LiveSessionHandle = {
  stop: () => Promise<void>;
  sendText: (text: string) => void;
  isMuted: () => boolean;
  toggleMute: () => Promise<boolean>;
};

type LiveSessionInternal = {
  close: () => void;
  sendRealtimeInput: (params: {
    audio?: { data: string; mimeType: string };
    audioStreamEnd?: boolean;
    text?: string;
  }) => void;
};

export async function startVoiceSession(
  options: StartVoiceSessionOptions
): Promise<LiveSessionHandle> {
  options.onStateChange("connecting");
  options.onStatus("Requesting ephemeral voice token...");

  const { token } = await createLiveSessionToken();
  const ai = new GoogleGenAI({
    apiKey: token,
    apiVersion: "v1alpha"
  });

  const audioContext = new AudioContext({ sampleRate: 24000 });
  const captureContext = new AudioContext({ sampleRate: 16000 });
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  });

  const source = captureContext.createMediaStreamSource(mediaStream);
  const processor = captureContext.createScriptProcessor(2048, 1, 1);
  const playbackNodes = new Set<AudioBufferSourceNode>();
  let playbackCursor = audioContext.currentTime;
  let muted = false;

  function stopPlayback() {
    for (const node of playbackNodes) {
      try {
        node.stop();
      } catch {}
    }
    playbackNodes.clear();
    playbackCursor = audioContext.currentTime;
  }

  function enqueuePlayback(base64: string) {
    const pcm16 = decodeBase64ToPcm16(base64);
    const buffer = pcm16ToAudioBuffer(audioContext, pcm16, 24000);
    const node = audioContext.createBufferSource();
    node.buffer = buffer;
    node.connect(audioContext.destination);
    node.onended = () => {
      playbackNodes.delete(node);
    };

    const startAt = Math.max(audioContext.currentTime, playbackCursor);
    node.start(startAt);
    playbackCursor = startAt + buffer.duration;
    playbackNodes.add(node);
  }

  const session = (await ai.live.connect({
    model: "gemini-3.1-flash-live-preview",
    config: {
      responseModalities: [Modality.AUDIO],
      inputAudioTranscription: {},
      outputAudioTranscription: {}
    },
    callbacks: {
      onopen: () => {
        options.onStateChange("connected");
        options.onStatus("Live voice session connected.");
      },
      onmessage: (response: any) => {
        const content = response?.serverContent;
        if (!content) return;

        if (content?.interrupted) {
          stopPlayback();
          options.onStatus("Playback interrupted by new speech.");
        }

        if (content?.modelTurn?.parts) {
          for (const part of content.modelTurn.parts) {
            if (part?.inlineData?.data) {
              enqueuePlayback(part.inlineData.data);
            }
          }
        }

        if (content?.inputTranscription?.text) {
          options.onMessage({
            role: "user",
            text: content.inputTranscription.text,
            timestamp: new Date().toISOString()
          });
        }

        if (content?.outputTranscription?.text) {
          options.onMessage({
            role: "assistant",
            text: content.outputTranscription.text,
            timestamp: new Date().toISOString()
          });
        }
      },
      onerror: (error) => {
        options.onStateChange("error");
        options.onStatus(error.message || "Voice session error.");
      },
      onclose: () => {
        options.onStateChange("idle");
        options.onStatus("Voice session closed.");
      }
    }
  })) as unknown as LiveSessionInternal;

  processor.onaudioprocess = (event) => {
    if (muted) return;

    const samples = event.inputBuffer.getChannelData(0);
    const copy = new Float32Array(samples.length);
    copy.set(samples);

    session.sendRealtimeInput({
      audio: {
        data: float32ToPcm16Base64(copy),
        mimeType: "audio/pcm;rate=16000"
      }
    });
  };

  source.connect(processor);
  processor.connect(captureContext.destination);
  await audioContext.resume();
  await captureContext.resume();

  return {
    async stop() {
      stopPlayback();
      session.close();
      processor.disconnect();
      source.disconnect();
      mediaStream.getTracks().forEach((track) => track.stop());
      await captureContext.close();
      await audioContext.close();
      options.onStateChange("idle");
    },
    sendText(text: string) {
      session.sendRealtimeInput({ text });
    },
    isMuted() {
      return muted;
    },
    async toggleMute() {
      muted = !muted;
      if (muted) {
        session.sendRealtimeInput({ audioStreamEnd: true });
        options.onStatus("Microphone muted.");
      } else {
        options.onStatus("Microphone active.");
      }
      return muted;
    }
  };
}
