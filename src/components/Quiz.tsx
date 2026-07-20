import { useEffect } from "react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import type { Question } from "@/data/types";
import { tr, UI, type Lang } from "@/lib/i18n";
import { LIKERT } from "@/lib/quiz";

type Props = {
  lang: Lang;
  question: Question;
  index: number;
  total: number;
  roundLabel: string;
  context: string;
  previous?: number;
  onAnswer: (v: number) => void;
  onBack: () => void;
};

export function Quiz({
  lang, question, index, total, roundLabel, context, previous, onAnswer, onBack,
}: Props) {
  const n = index + 1;

  // Number keys answer, Backspace/← steps back — the whole quiz is keyboard-only.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key >= "1" && e.key <= "5") {
        e.preventDefault();
        onAnswer(Number(e.key));
      } else if ((e.key === "Backspace" || e.key === "ArrowLeft") && index > 0) {
        e.preventDefault();
        onBack();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onAnswer, onBack]);

  return (
    <section className="quiz">
      <div className="quiz-head">
        <span className="round-chip">{roundLabel}</span>
        <span className="quiz-context">{context}</span>
      </div>

      <div
        className="progress"
        role="progressbar"
        aria-valuenow={n}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div className="progress-fill" style={{ width: `${((n - 1) / total) * 100}%` }} />
      </div>

      <p className="q-count">
        {tr(lang, UI.qOf).replace("{a}", String(n)).replace("{b}", String(total))}
      </p>

      <blockquote className="statement" lang={lang === "hi" ? "hi-Latn" : "en"}>
        {tr(lang, question.t)}
      </blockquote>

      <div className="meter" role="radiogroup" aria-label={`${tr(lang, UI.disagree)} – ${tr(lang, UI.agree)}`}>
        {LIKERT.map((o) => (
          <button
            key={o.v}
            type="button"
            className={`notch n${o.v}${previous === o.v ? " picked" : ""}`}
            role="radio"
            aria-checked={previous === o.v}
            onClick={() => onAnswer(o.v)}
          >
            <span className="notch-bar" />
            <span className="notch-num">{o.v}</span>
            <span className="notch-label">{tr(lang, o.label)}</span>
          </button>
        ))}
      </div>

      <div className="meter-ends">
        <span>{tr(lang, UI.disagree)}</span>
        <span>{tr(lang, UI.agree)}</span>
      </div>

      <p className="kbd-hint">
        {tr(lang, UI.kbdHint)}
        <KbdGroup>
          <Kbd>1</Kbd><Kbd>2</Kbd><Kbd>3</Kbd><Kbd>4</Kbd><Kbd>5</Kbd>
        </KbdGroup>
        {tr(lang, UI.kbdHintEnd)}
      </p>

      <div className="quiz-nav">
        {index > 0 ? (
          <button className="ghost-btn" onClick={onBack}>
            ← {tr(lang, UI.back)} <Kbd className="ml-1">⌫</Kbd>
          </button>
        ) : (
          <span />
        )}
      </div>
    </section>
  );
}
