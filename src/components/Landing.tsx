import type { Track } from "@/data/types";
import { tr, UI, type Lang } from "@/lib/i18n";

export function Landing({
  lang, tracks, onPick,
}: {
  lang: Lang;
  tracks: Track[];
  onPick: (t: Track) => void;
}) {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">{tr(lang, UI.tagline)}</p>
        <h1 className="hero-title">{tr(lang, UI.heroTitle)}</h1>
        <p className="hero-body">{tr(lang, UI.heroBody)}</p>
      </section>

      <section className="tracks">
        <h2 className="section-label">{tr(lang, UI.pickTrack)}</h2>
        <div className="track-grid">
          {tracks.map((t) => (
            <button key={t.id} className="track-card" onClick={() => onPick(t)}>
              <span className="track-name">{tr(lang, t.name)}</span>
              <span className="track-tag">{tr(lang, t.tagline)}</span>
              <span className="track-meta">
                {t.majors.length} majors · {t.round1Questions.length + 10} {tr(lang, UI.begin)}
              </span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
