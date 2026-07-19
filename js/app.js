/* Stream Select — quiz engine. All state lives client-side; nothing is sent anywhere. */
(function () {
  "use strict";

  const TRACKS = [window.TRACK_BTECH, window.TRACK_MBA];

  // ---------- UI strings ----------
  const UI = {
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
      en: "Your ratings were almost the same for everything, so every branch scored alike. Retake the round and rate boldly — 5 for \"totally me\", 1 for \"not me at all\".",
      hi: "Tumne lagbhag har statement ko same rating di, isliye har branch ka score barabar aa gaya. Round dobara do aur khul ke rate karo — jo bilkul tum ho use 5, jo bilkul nahi use 1.",
    },
    retake: { en: "Retake this round", hi: "Round dobara do" },
    footer: {
      en: "Runs fully in your browser · nothing is stored or sent anywhere",
      hi: "Poora browser me chalta hai · kuch bhi store ya send nahi hota",
    },
    begin: { en: "questions", hi: "questions" },
    inside: { en: "Inside {m}", hi: "{m} ke andar" },
  };

  const LIKERT = [
    { v: 1, label: { en: "No, not me", hi: "Nahi yaar" } },
    { v: 2, label: { en: "Not really", hi: "Zyada nahi" } },
    { v: 3, label: { en: "Somewhat", hi: "Thoda bahut" } },
    { v: 4, label: { en: "Mostly yes", hi: "Kaafi had tak" } },
    { v: 5, label: { en: "Totally me", hi: "Bilkul main" } },
  ];

  // ---------- state ----------
  const state = {
    lang: localStorage.getItem("ss-lang") || "en",
    screen: "landing", // landing | quiz | result1 | result2
    track: null,
    round: 1,
    major: null, // chosen major object after round 1
    questions: [],
    qIndex: 0,
    answers: [],
    r1Scores: null,
  };

  const app = document.getElementById("app");
  const t = (obj) => (typeof obj === "string" ? obj : obj[state.lang] || obj.en);

  // ---------- scoring ----------
  // % match per branch = sum(answer × weight) / sum(5 × weight), so branches with
  // different question coverage compare fairly.
  function score(questions, answers) {
    const got = {}, max = {};
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

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- rendering ----------
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function render() {
    document.getElementById("langToggle").textContent = state.lang === "en" ? "हिं Hinglish" : "EN English";
    document.getElementById("footerNote").textContent = t(UI.footer);
    if (state.screen === "landing") renderLanding();
    else if (state.screen === "quiz") renderQuiz();
    else renderResult();
    window.scrollTo({ top: 0 });
  }

  function renderLanding() {
    app.innerHTML = `
      <section class="hero">
        <p class="eyebrow">${t(UI.tagline)}</p>
        <h1 class="hero-title">${t(UI.heroTitle)}</h1>
        <p class="hero-body">${t(UI.heroBody)}</p>
      </section>
      <section class="tracks">
        <h2 class="section-label">${t(UI.pickTrack)}</h2>
        <div class="track-grid">
          ${TRACKS.map(
            (tr) => `
            <button class="track-card" data-track="${tr.id}">
              <span class="track-name">${t(tr.name)}</span>
              <span class="track-tag">${t(tr.tagline)}</span>
              <span class="track-meta">${tr.majors.length} majors · ${tr.round1Questions.length + 10} ${t(UI.begin)}</span>
            </button>`
          ).join("")}
        </div>
      </section>`;
    app.querySelectorAll(".track-card").forEach((el) =>
      el.addEventListener("click", () => startRound1(TRACKS.find((tr) => tr.id === el.dataset.track)))
    );
  }

  function startRound1(track) {
    state.track = track;
    state.round = 1;
    state.major = null;
    state.questions = shuffle(track.round1Questions);
    state.qIndex = 0;
    state.answers = [];
    state.screen = "quiz";
    render();
  }

  function startRound2(major) {
    state.major = major;
    state.round = 2;
    state.questions = shuffle(state.track.round2Questions[major.id]);
    state.qIndex = 0;
    state.answers = [];
    state.screen = "quiz";
    render();
  }

  function renderQuiz() {
    const q = state.questions[state.qIndex];
    const total = state.questions.length;
    const n = state.qIndex + 1;
    const roundLabel = state.round === 1 ? t(UI.round1) : t(UI.round2);
    const context = state.round === 2 ? t(UI.inside).replace("{m}", t(state.major.name)) : t(state.track.name);
    const prev = state.answers[state.qIndex];

    app.innerHTML = `
      <section class="quiz">
        <div class="quiz-head">
          <span class="round-chip">${roundLabel}</span>
          <span class="quiz-context">${context}</span>
        </div>
        <div class="progress" role="progressbar" aria-valuenow="${n}" aria-valuemin="1" aria-valuemax="${total}">
          <div class="progress-fill" style="width:${((n - 1) / total) * 100}%"></div>
        </div>
        <p class="q-count">${t(UI.qOf).replace("{a}", n).replace("{b}", total)}</p>
        <blockquote class="statement" lang="${state.lang === "hi" ? "hi-Latn" : "en"}">${esc(t(q.t))}</blockquote>
        <div class="meter" role="radiogroup" aria-label="${t(UI.disagree)} – ${t(UI.agree)}">
          ${LIKERT.map(
            (o) => `
            <button class="notch n${o.v} ${prev === o.v ? "picked" : ""}" data-v="${o.v}" role="radio" aria-checked="${prev === o.v}">
              <span class="notch-bar"></span>
              <span class="notch-num">${o.v}</span>
              <span class="notch-label">${t(o.label)}</span>
            </button>`
          ).join("")}
        </div>
        <div class="meter-ends"><span>${t(UI.disagree)}</span><span>${t(UI.agree)}</span></div>
        <div class="quiz-nav">
          ${state.qIndex > 0 ? `<button class="ghost-btn" id="backBtn">← ${t(UI.back)}</button>` : "<span></span>"}
        </div>
      </section>`;

    app.querySelectorAll(".notch").forEach((el) =>
      el.addEventListener("click", () => {
        state.answers[state.qIndex] = Number(el.dataset.v);
        el.classList.add("picked");
        setTimeout(() => {
          if (state.qIndex + 1 < total) {
            state.qIndex++;
            render();
          } else {
            finishRound();
          }
        }, 160);
      })
    );
    const back = document.getElementById("backBtn");
    if (back) back.addEventListener("click", () => { state.qIndex--; render(); });
  }

  function finishRound() {
    const results = score(state.questions, state.answers);
    if (state.round === 1) {
      state.r1Scores = results;
      state.screen = "result1";
    } else {
      state.r2Scores = results;
      state.screen = "result2";
    }
    render();
  }

  function branchById(id) {
    return state.round === 1 || state.screen === "result1"
      ? state.track.majors.find((m) => m.id === id)
      : state.major.specializations.find((s) => s.id === id);
  }

  function renderResult() {
    const isR1 = state.screen === "result1";
    const results = isR1 ? state.r1Scores : state.r2Scores;

    // Flat scores mean the answers carried no signal — a tie-broken "winner"
    // would just be shuffle luck, so ask for a braver retake instead.
    const spread = results[0].pct - results[results.length - 1].pct;
    if (spread <= 7) {
      renderFlatResult(isR1, results);
      return;
    }
    const top = branchById(results[0].id);
    const second = branchById(results[1].id);
    const closeCall = results[0].pct - results[1].pct <= 5;

    app.innerHTML = `
      <section class="result">
        <p class="eyebrow">${isR1 ? t(UI.r1ResultTitle) : t(UI.r2ResultTitle)}</p>
        <h1 class="result-title">${t(top.name)}</h1>
        <p class="result-pct"><strong>${results[0].pct}%</strong> ${t(UI.yourMatch)}</p>
        <p class="result-desc">${t(top.desc)}</p>
        ${closeCall ? `<p class="close-call">⚖ ${t(UI.closeCall)} <strong>${t(second.name)}</strong> (${results[1].pct}%)</p>` : ""}
        <div class="careers">
          <span class="section-label">${t(UI.careersLabel)}</span>
          <ul>${top.careers.map((c) => `<li>${c}</li>`).join("")}</ul>
        </div>

        <figure class="chart">
          <figcaption class="section-label">${isR1 ? t(UI.allScores) : t(UI.allScores2)}</figcaption>
          ${results.map((r, i) => {
            const b = branchById(r.id);
            return `
            <div class="bar-row ${i === 0 ? "top" : ""}">
              <span class="bar-name">${t(b.name)}</span>
              <span class="bar-track"><span class="bar-fill" style="--w:${r.pct}%"></span></span>
              <span class="bar-val">${r.pct}%</span>
            </div>`;
          }).join("")}
        </figure>

        <p class="result-note">${t(UI.resultNote)}</p>
        <div class="result-actions">
          ${isR1
            ? `<button class="primary-btn" id="goR2">${t(UI.goRound2)} → ${t(top.name)}</button>
               <button class="ghost-btn" id="goR2b">${t(UI.pickOther)} → ${t(second.name)}</button>`
            : ""}
          <button class="ghost-btn" id="restart">↺ ${t(UI.startOver)}</button>
        </div>
      </section>`;

    if (isR1) {
      document.getElementById("goR2").addEventListener("click", () => startRound2(top));
      document.getElementById("goR2b").addEventListener("click", () => startRound2(second));
    }
    document.getElementById("restart").addEventListener("click", () => {
      state.screen = "landing";
      state.track = null;
      render();
    });
    requestAnimationFrame(() =>
      app.querySelectorAll(".bar-fill").forEach((el) => el.classList.add("grow"))
    );
  }

  function renderFlatResult(isR1, results) {
    app.innerHTML = `
      <section class="result">
        <p class="eyebrow">${isR1 ? t(UI.r1ResultTitle) : t(UI.r2ResultTitle)}</p>
        <h1 class="result-title">${t(UI.flatTitle)}</h1>
        <p class="result-desc" style="margin-top:12px">${t(UI.flatBody)}</p>
        <figure class="chart">
          <figcaption class="section-label">${isR1 ? t(UI.allScores) : t(UI.allScores2)}</figcaption>
          ${results.map((r) => {
            const b = branchById(r.id);
            return `
            <div class="bar-row">
              <span class="bar-name">${t(b.name)}</span>
              <span class="bar-track"><span class="bar-fill" style="--w:${r.pct}%"></span></span>
              <span class="bar-val">${r.pct}%</span>
            </div>`;
          }).join("")}
        </figure>
        <div class="result-actions">
          <button class="primary-btn" id="retake">↻ ${t(UI.retake)}</button>
          <button class="ghost-btn" id="restart">${t(UI.startOver)}</button>
        </div>
      </section>`;
    document.getElementById("retake").addEventListener("click", () =>
      isR1 ? startRound1(state.track) : startRound2(state.major)
    );
    document.getElementById("restart").addEventListener("click", () => {
      state.screen = "landing";
      state.track = null;
      render();
    });
    requestAnimationFrame(() =>
      app.querySelectorAll(".bar-fill").forEach((el) => el.classList.add("grow"))
    );
  }

  // ---------- global controls ----------
  document.getElementById("langToggle").addEventListener("click", () => {
    state.lang = state.lang === "en" ? "hi" : "en";
    localStorage.setItem("ss-lang", state.lang);
    render();
  });
  document.getElementById("brandHome").addEventListener("click", () => {
    state.screen = "landing";
    state.track = null;
    render();
  });

  render();
})();
