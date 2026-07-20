import { useEffect, useState } from "react";
import { BranchPreview } from "@/components/BranchPreview";
import type { Specialization } from "@/data/types";
import { tr, UI, type Lang } from "@/lib/i18n";
import { isFlat, type Score } from "@/lib/quiz";

type Props = {
  lang: Lang;
  isR1: boolean;
  results: Score[];
  branchById: (id: string) => Specialization;
  onRound2: (branch: Specialization) => void;
  onRetake: () => void;
  onRestart: () => void;
};

/** Bars animate from zero once mounted; reduced-motion users get them instantly. */
function useGrown() {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return grown;
}

function Chart({
  lang, results, branchById, caption, hint, emphasiseTop,
}: {
  lang: Lang;
  results: Score[];
  branchById: (id: string) => Specialization;
  caption: string;
  hint: string;
  emphasiseTop: boolean;
}) {
  const grown = useGrown();
  return (
    <figure className="chart">
      <figcaption className="section-label">
        {caption}
        <span className="chart-hint">{hint}</span>
      </figcaption>
      {results.map((r, i) => (
        <div key={r.id} className={`bar-row${emphasiseTop && i === 0 ? " top" : ""}`}>
          <BranchPreview branch={branchById(r.id)} lang={lang} />
          <span className="bar-track">
            <span
              className={`bar-fill${grown ? " grow" : ""}`}
              style={{ "--w": `${r.pct}%` } as React.CSSProperties}
            />
          </span>
          <span className="bar-val">{r.pct}%</span>
        </div>
      ))}
    </figure>
  );
}

export function Result({
  lang, isR1, results, branchById, onRound2, onRetake, onRestart,
}: Props) {
  const caption = isR1 ? tr(lang, UI.allScores) : tr(lang, UI.allScores2);
  const eyebrow = isR1 ? tr(lang, UI.r1ResultTitle) : tr(lang, UI.r2ResultTitle);

  if (isFlat(results)) {
    return (
      <section className="result">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="result-title">{tr(lang, UI.flatTitle)}</h1>
        <p className="result-desc" style={{ marginTop: 12 }}>{tr(lang, UI.flatBody)}</p>
        <Chart
          lang={lang} results={results} branchById={branchById}
          caption={caption} hint={tr(lang, UI.hoverHint)} emphasiseTop={false}
        />
        <div className="result-actions">
          <button className="primary-btn" onClick={onRetake}>↻ {tr(lang, UI.retake)}</button>
          <button className="ghost-btn" onClick={onRestart}>{tr(lang, UI.startOver)}</button>
        </div>
      </section>
    );
  }

  const top = branchById(results[0].id);
  const second = branchById(results[1].id);
  const closeCall = results[0].pct - results[1].pct <= 5;

  return (
    <section className="result">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="result-title">{tr(lang, top.name)}</h1>
      <p className="result-pct">
        <strong>{results[0].pct}%</strong> {tr(lang, UI.yourMatch)}
      </p>
      <p className="result-desc">{tr(lang, top.desc)}</p>

      {closeCall && (
        <p className="close-call">
          ⚖ {tr(lang, UI.closeCall)} <strong>{tr(lang, second.name)}</strong> ({results[1].pct}%)
        </p>
      )}

      <div className="careers">
        <span className="section-label">{tr(lang, UI.careersLabel)}</span>
        <ul>{top.careers.map((c) => <li key={c}>{c}</li>)}</ul>
      </div>

      <Chart
        lang={lang} results={results} branchById={branchById}
        caption={caption} hint={tr(lang, UI.hoverHint)} emphasiseTop
      />

      <p className="result-note">{tr(lang, UI.resultNote)}</p>
      <div className="result-actions">
        {isR1 && (
          <>
            <button className="primary-btn" onClick={() => onRound2(top)}>
              {tr(lang, UI.goRound2)} → {tr(lang, top.name)}
            </button>
            <button className="ghost-btn" onClick={() => onRound2(second)}>
              {tr(lang, UI.pickOther)} → {tr(lang, second.name)}
            </button>
          </>
        )}
        <button className="ghost-btn" onClick={onRestart}>↺ {tr(lang, UI.startOver)}</button>
      </div>
    </section>
  );
}
