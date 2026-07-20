import type { Loc } from "@/data/types";

export type Lang = "en" | "hi";

export const LANG_KEY = "ss-lang";

export function loadLang(): Lang {
  return localStorage.getItem(LANG_KEY) === "hi" ? "hi" : "en";
}

/** Resolve a localised string for the active language. */
export const tr = (lang: Lang, v: Loc) => v[lang] || v.en;

export const UI = {
  tagline: { en: "Two short rounds. Honest answers. Your best-fit stream.", hi: "Do chhote rounds. Sachhe jawab. Tumhari best-fit stream." },
  pickTrack: { en: "What are you choosing a stream for?", hi: "Kis course ke liye stream choose karni hai?" },
  heroTitle: { en: "Which stream actually fits you?", hi: "Kaunsi stream tum pe actually fit hoti hai?" },
  heroBody: {
    en: "Rate simple statements about yourself from 1 to 5. Round 1 finds your major branch; Round 2 goes deeper into its specialisations. No login, no data leaves your browser.",
    hi: "Apne baare me simple statements ko 1 se 5 rate karo. Round 1 tumhari major branch nikalta hai; Round 2 uske andar ki specialisations me deep jaata hai. No login — data browser se bahar nahi jaata.",
  },
  round1: { en: "Round 1 · Major branch", hi: "Round 1 · Major branch" },
  round2: { en: "Round 2 · Specialisation", hi: "Round 2 · Specialisation" },
  qOf: { en: "Question {a} of {b}", hi: "Question {a} / {b}" },
  disagree: { en: "Disagree", hi: "Nahi lagta" },
  agree: { en: "Agree", hi: "Bilkul main" },
  back: { en: "Back", hi: "Back" },
  yourMatch: { en: "match", hi: "match" },
  r1ResultTitle: { en: "Your major branch", hi: "Tumhari major branch" },
  r2ResultTitle: { en: "Your specialisation", hi: "Tumhari specialisation" },
  allScores: { en: "How every branch scored", hi: "Har branch ka score" },
  allScores2: { en: "How every specialisation scored", hi: "Har specialisation ka score" },
  careersLabel: { en: "Roles this leads to", hi: "Ye kin roles tak le jaata hai" },
  goRound2: { en: "Start Round 2 — go deeper", hi: "Round 2 shuru karo — aur deep" },
  pickOther: { en: "Explore #2 instead", hi: "#2 wali explore karo" },
  startOver: { en: "Start over", hi: "Phir se shuru karo" },
  resultNote: {
    en: "This is a signal, not a verdict — talk to seniors and try small projects in your top two.",
    hi: "Ye ek signal hai, final faisla nahi — seniors se baat karo aur top do me chhote projects try karo.",
  },
  closeCall: { en: "Close call with", hi: "Kaanta-takkar hai" },
  flatTitle: { en: "No clear winner yet", hi: "Abhi koi clear winner nahi" },
  flatBody: {
    en: "Your ratings were almost the same for everything, so every branch scored alike. Retake the round and rate boldly — 5 for “totally me”, 1 for “not me at all”.",
    hi: "Tumne lagbhag har statement ko same rating di, isliye har branch ka score barabar aa gaya. Round dobara do aur khul ke rate karo — jo bilkul tum ho use 5, jo bilkul nahi use 1.",
  },
  retake: { en: "Retake this round", hi: "Round dobara do" },
  footer: {
    en: "Runs fully in your browser · nothing is stored or sent anywhere",
    hi: "Poora browser me chalta hai · kuch bhi store ya send nahi hota",
  },
  begin: { en: "questions", hi: "questions" },
  inside: { en: "Inside {m}", hi: "{m} ke andar" },

  // menu + keyboard
  menu: { en: "Menu", hi: "Menu" },
  language: { en: "Language", hi: "Language" },
  english: { en: "English", hi: "English" },
  hinglish: { en: "Hinglish", hi: "Hinglish" },
  restart: { en: "Start over", hi: "Phir se shuru karo" },
  switchTrack: { en: "Switch course", hi: "Course badlo" },
  kbdHint: { en: "Tip: press", hi: "Tip: dabao" },
  kbdHintEnd: { en: "to answer", hi: "answer karne ke liye" },
  hoverHint: { en: "Hover a branch name to preview it", hi: "Branch ke naam pe hover karo preview ke liye" },

  // toasts
  toastLang: { en: "Switched to English", hi: "Hinglish pe switch ho gaya" },
  toastRound1: { en: "Round 1 done — here's your major branch", hi: "Round 1 ho gaya — ye rahi tumhari major branch" },
  toastRound2: { en: "Round 2 done — here's your specialisation", hi: "Round 2 ho gaya — ye rahi tumhari specialisation" },
  toastRestart: { en: "Cleared — starting fresh", hi: "Clear ho gaya — phir se shuru" },
  toastFlat: { en: "Answers were too similar to call a winner", hi: "Jawab itne similar the ke winner nahi nikla" },
} satisfies Record<string, Loc>;
