import type { VoiceSessionMessage } from "./session";

export function mergeTranscriptMessage(
  messages: VoiceSessionMessage[],
  incoming: VoiceSessionMessage,
  limit = 40
) {
  const last = messages.at(-1);
  if (last && last.role === incoming.role && !last.final) {
    return [
      ...messages.slice(0, -1),
      {
        ...incoming,
        text: `${last.text}${incoming.text}`
      }
    ].slice(-limit);
  }

  return [...messages, incoming].slice(-limit);
}
