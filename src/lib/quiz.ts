import type { Question } from "@/data/types";

export type Score = { id: string; pct: number };

/**
 * % match per branch = sum(answer × weight) / sum(5 × weight), so branches with
 * different question coverage compare fairly.
 */
export function score(questions: Question[], answers: number[]): Score[] {
  const got: Record<string, number> = {};
  const max: Record<string, number> = {};
  questions.forEach((q, i) => {
    const a = answers[i];
    for (const [id, w] of Object.entries(q.w)) {
      got[id] = (got[id] || 0) + a * w;
      max[id] = (max[id] || 0) + 5 * w;
    }
  });
  return Object.keys(max)
    .map((id) => ({ id, pct: Math.round((got[id] / max[id]) * 100) }))
    .sort((a, b) => b.pct - a.pct);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Flat scores mean the answers carried no signal — a tie-broken "winner" would
 * just be shuffle luck, so the result screen asks for a braver retake instead.
 */
export const FLAT_SPREAD = 7;
export const isFlat = (results: Score[]) =>
  results[0].pct - results[results.length - 1].pct <= FLAT_SPREAD;

export const LIKERT = [
  { v: 1, label: { en: "No, not me", hi: "Nahi yaar" } },
  { v: 2, label: { en: "Not really", hi: "Zyada nahi" } },
  { v: 3, label: { en: "Somewhat", hi: "Thoda bahut" } },
  { v: 4, label: { en: "Mostly yes", hi: "Kaafi had tak" } },
  { v: 5, label: { en: "Totally me", hi: "Bilkul main" } },
] as const;
