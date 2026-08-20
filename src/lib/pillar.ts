import type { Pillar } from "@/src/content/content";

/** First sentence of a body paragraph, used as the "why" without rewriting it. */
export function firstSentence(text: string) {
  const end = text.indexOf(". ");
  return end === -1 ? text : text.slice(0, end + 1);
}

/**
 * Why, what and how read straight off the pillar. Shared by the Cascade hero
 * row and the brief route so the two cannot drift apart.
 */
export function pillarFields(pillar: Pillar) {
  return {
    why: firstSentence(pillar.body),
    what: pillar.statement,
    how: pillar.proof,
  };
}
