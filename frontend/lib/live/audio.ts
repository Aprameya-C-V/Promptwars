export function float32ToPcm16Base64(input: Float32Array): string {
  const buffer = new ArrayBuffer(input.length * 2);
  const view = new DataView(buffer);

  for (let index = 0; index < input.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, input[index] ?? 0));
    view.setInt16(index * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }

  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const slice = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...slice);
  }

  return btoa(binary);
}

export function decodeBase64ToPcm16(base64: string): Int16Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Int16Array(bytes.buffer);
}

export function pcm16ToAudioBuffer(
  context: AudioContext,
  pcm16: Int16Array,
  sampleRate: number
): AudioBuffer {
  const audioBuffer = context.createBuffer(1, pcm16.length, sampleRate);
  const channel = audioBuffer.getChannelData(0);

  for (let index = 0; index < pcm16.length; index += 1) {
    channel[index] = pcm16[index] / 0x7fff;
  }

  return audioBuffer;
}

