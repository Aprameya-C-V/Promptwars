const immediateRiskPatterns = [
  /\bkill myself\b/i,
  /\bend my life\b/i,
  /\bsuicid(?:e|al)\b/i,
  /\bself harm\b/i,
  /\bhurt myself\b/i,
  /\bdon't want to live\b/i
];

export function hasImmediateRiskLanguage(text: string) {
  return immediateRiskPatterns.some((pattern) => pattern.test(text));
}
