import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Landing } from "@/components/Landing";
import { Quiz } from "@/components/Quiz";
import { Result } from "@/components/Result";
import { TopBar } from "@/components/TopBar";
import { BTECH } from "@/data/btech";
import { MBA } from "@/data/mba";
import type { Major, Question, Specialization, Track } from "@/data/types";
import { LANG_KEY, loadLang, tr, UI, type Lang } from "@/lib/i18n";
import { isFlat, score, shuffle, type Score } from "@/lib/quiz";

const TRACKS: Track[] = [BTECH, MBA];
type Screen = "landing" | "quiz" | "result1" | "result2";

export default function App() {
  const [lang, setLang] = useState<Lang>(loadLang);
  const [screen, setScreen] = useState<Screen>("landing");
  const [track, setTrack] = useState<Track | null>(null);
  const [round, setRound] = useState<1 | 2>(1);
  const [major, setMajor] = useState<Major | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [r1Scores, setR1Scores] = useState<Score[] | null>(null);
  const [r2Scores, setR2Scores] = useState<Score[] | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [screen, qIndex]);

  const changeLang = useCallback((l: Lang) => {
    setLang(l);
    localStorage.setItem(LANG_KEY, l);
    // Confirm in the language just switched to, so the toast itself shows the change.
    toast.success(UI.toastLang[l]);
  }, []);

  const goHome = useCallback(() => {
    setScreen("landing");
    setTrack(null);
    setMajor(null);
    setAnswers([]);
  }, []);

  const restart = useCallback(() => {
    goHome();
    toast(tr(lang, UI.toastRestart));
  }, [goHome, lang]);

  const startRound1 = useCallback((t: Track) => {
    setTrack(t);
    setRound(1);
    setMajor(null);
    setQuestions(shuffle(t.round1Questions));
    setQIndex(0);
    setAnswers([]);
    setScreen("quiz");
  }, []);

  const startRound2 = useCallback(
    (m: Specialization) => {
      if (!track) return;
      setMajor(m as Major);
      setRound(2);
      setQuestions(shuffle(track.round2Questions[m.id]));
      setQIndex(0);
      setAnswers([]);
      setScreen("quiz");
    },
    [track]
  );

  const answer = useCallback(
    (v: number) => {
      const next = answers.slice();
      next[qIndex] = v;
      setAnswers(next);

      if (qIndex + 1 < questions.length) {
        setQIndex(qIndex + 1);
        return;
      }
      const results = score(questions, next);
      const flat = isFlat(results);
      if (round === 1) {
        setR1Scores(results);
        setScreen("result1");
      } else {
        setR2Scores(results);
        setScreen("result2");
      }
      toast[flat ? "warning" : "success"](
        flat ? tr(lang, UI.toastFlat) : tr(lang, round === 1 ? UI.toastRound1 : UI.toastRound2)
      );
    },
    [answers, qIndex, questions, round, lang]
  );

  const back = useCallback(() => setQIndex((i) => Math.max(0, i - 1)), []);

  // Global shortcuts: L flips the language, R starts over.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "l") changeLang(lang === "en" ? "hi" : "en");
      else if (k === "r") restart();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lang, changeLang, restart]);

  const branchById = useCallback(
    (id: string): Specialization => {
      if (screen === "result1") return track!.majors.find((m) => m.id === id)!;
      return major!.specializations.find((s) => s.id === id)!;
    },
    [screen, track, major]
  );

  return (
    <>
      <TopBar
        lang={lang}
        onLang={changeLang}
        onHome={goHome}
        onRestart={restart}
        inQuiz={screen !== "landing"}
      />

      <main>
        {screen === "landing" && (
          <Landing lang={lang} tracks={TRACKS} onPick={startRound1} />
        )}

        {screen === "quiz" && questions.length > 0 && (
          <Quiz
            lang={lang}
            question={questions[qIndex]}
            index={qIndex}
            total={questions.length}
            roundLabel={tr(lang, round === 1 ? UI.round1 : UI.round2)}
            context={
              round === 2 && major
                ? tr(lang, UI.inside).replace("{m}", tr(lang, major.name))
                : track
                  ? tr(lang, track.name)
                  : ""
            }
            previous={answers[qIndex]}
            onAnswer={answer}
            onBack={back}
          />
        )}

        {(screen === "result1" || screen === "result2") && (
          <Result
            lang={lang}
            isR1={screen === "result1"}
            results={(screen === "result1" ? r1Scores : r2Scores)!}
            branchById={branchById}
            onRound2={startRound2}
            onRetake={() =>
              screen === "result1" ? startRound1(track!) : startRound2(major!)
            }
            onRestart={restart}
          />
        )}
      </main>

      <footer className="footer">{tr(lang, UI.footer)}</footer>
    </>
  );
}
