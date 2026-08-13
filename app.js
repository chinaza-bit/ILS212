(function () {
  "use strict";

  const MODULE_NAMES = {
    1: "Module 1 · Needs & Access",
    2: "Module 2 · Libraries",
    3: "Module 3 · Search & Study",
    4: "Module 4 · Access Tools",
    5: "Module 5 · Ethics & AI",
    6: "Past Questions · CAT",
  };

  const MODULE_SHORT_NAMES = {
    1: "Needs & Access",
    2: "Libraries",
    3: "Search & Study",
    4: "Access Tools",
    5: "Ethics & AI",
    6: "Past Questions",
  };

  const FULL_BANK = QUESTION_BANK.concat(
    typeof PAST_QUESTIONS !== "undefined" ? PAST_QUESTIONS : []
  );

  const TOTAL_AVAILABLE = FULL_BANK.length;
  const MAX_QUESTIONS = Math.min(200, TOTAL_AVAILABLE);

  // ---------- DOM ----------
  const screens = {
    setup: document.getElementById("screen-setup"),
    quiz: document.getElementById("screen-quiz"),
    results: document.getElementById("screen-results"),
  };

  const countDisplay = document.getElementById("count-display");
  const countMax = document.getElementById("count-max");
  const countChips = document.getElementById("count-chips");
  const countSlider = document.getElementById("count-slider");
  const moduleChips = document.getElementById("module-chips");
  const btnStart = document.getElementById("btn-start");
  const setupWarning = document.getElementById("setup-warning");

  const qPosition = document.getElementById("q-position");
  const qTotal = document.getElementById("q-total");
  const runningScore = document.getElementById("running-score");
  const progressFill = document.getElementById("progress-fill");
  const qModuleLabel = document.getElementById("q-module-label");
  const qId = document.getElementById("q-id");
  const qText = document.getElementById("q-text");
  const optionsList = document.getElementById("options-list");
  const feedbackEl = document.getElementById("feedback");
  const btnNext = document.getElementById("btn-next");

  const finalScore = document.getElementById("final-score");
  const finalTotal = document.getElementById("final-total");
  const finalPct = document.getElementById("final-pct");
  const finalRemark = document.getElementById("final-remark");
  const moduleBreakdown = document.getElementById("module-breakdown");
  const btnReview = document.getElementById("btn-review");
  const btnRestart = document.getElementById("btn-restart");
  const reviewList = document.getElementById("review-list");

  // ---------- state ----------
  let selectedCount = 20;
  let activeModules = new Set([1, 2, 3, 4, 5, 6]);
  let quizQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let answered = false;
  let attempts = []; // {q, chosenIndex, correctIndex, isCorrect}

  countMax.textContent = MAX_QUESTIONS;
  countSlider.max = MAX_QUESTIONS;
  document.getElementById("chip-all").textContent = `All ${MAX_QUESTIONS}`;

  // ---------- helpers ----------
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
      el.hidden = key !== name;
    });
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function clampCount(n) {
    return Math.max(1, Math.min(n, MAX_QUESTIONS));
  }

  function syncCountUI(n) {
    selectedCount = clampCount(n);
    countDisplay.textContent = selectedCount;
    countSlider.value = selectedCount;
    [...countChips.children].forEach((chip) => {
      const val = chip.dataset.count;
      const chipVal = val === "all" ? MAX_QUESTIONS : Number(val);
      chip.classList.toggle("is-active", chipVal === selectedCount);
    });
  }

  // ---------- setup interactions ----------
  countChips.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const val = btn.dataset.count;
    syncCountUI(val === "all" ? MAX_QUESTIONS : Number(val));
  });

  countSlider.addEventListener("input", (e) => {
    syncCountUI(Number(e.target.value));
  });

  moduleChips.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const mod = Number(btn.dataset.module);
    if (activeModules.has(mod)) {
      if (activeModules.size === 1) return; // keep at least one
      activeModules.delete(mod);
      btn.classList.remove("is-active");
    } else {
      activeModules.add(mod);
      btn.classList.add("is-active");
    }
    setupWarning.hidden = true;
  });

  btnStart.addEventListener("click", startQuiz);

  syncCountUI(selectedCount);

  // ---------- quiz flow ----------
  function startQuiz() {
    const pool = FULL_BANK.filter((q) => activeModules.has(q.module));
    if (pool.length === 0) {
      setupWarning.hidden = false;
      return;
    }
    const n = Math.min(selectedCount, pool.length);
    quizQuestions = shuffle(pool).slice(0, n).map((q) => {
      // shuffle options but remember the correct answer text
      const correctText = q.options[q.a];
      const shuffledOptions = shuffle(q.options);
      return {
        module: q.module,
        text: q.q,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(correctText),
      };
    });

    currentIndex = 0;
    score = 0;
    attempts = [];
    qTotal.textContent = quizQuestions.length;
    runningScore.textContent = "0";
    showScreen("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    answered = false;
    const q = quizQuestions[currentIndex];
    qPosition.textContent = currentIndex + 1;
    progressFill.style.width = `${(currentIndex / quizQuestions.length) * 100}%`;
    qModuleLabel.textContent = MODULE_NAMES[q.module];
    qId.textContent = `Card ${String(currentIndex + 1).padStart(3, "0")}`;
    document.getElementById("index-card").classList.toggle("index-card--past", q.module === 6);
    qText.textContent = q.text;
    feedbackEl.textContent = "";
    feedbackEl.className = "index-card__feedback";
    btnNext.disabled = true;
    btnNext.textContent = currentIndex === quizQuestions.length - 1 ? "See Results" : "Next Card";

    optionsList.innerHTML = "";
    const letters = ["A", "B", "C", "D", "E", "F"];
    q.options.forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.innerHTML = `<span class="option__letter">${letters[idx]}</span><span>${escapeHTML(optText)}</span>`;
      btn.addEventListener("click", () => selectOption(idx, btn));
      optionsList.appendChild(btn);
    });
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function selectOption(idx, btnEl) {
    if (answered) return;
    answered = true;
    const q = quizQuestions[currentIndex];
    const isCorrect = idx === q.correctIndex;

    [...optionsList.children].forEach((child, i) => {
      child.disabled = true;
      if (i === q.correctIndex) child.classList.add("is-correct");
      if (i === idx && !isCorrect) child.classList.add("is-wrong");
    });

    if (isCorrect) {
      score += 1;
      runningScore.textContent = score;
      feedbackEl.textContent = "Correct.";
      feedbackEl.classList.add("is-correct");
    } else {
      feedbackEl.textContent = `Not quite. Correct answer: ${q.options[q.correctIndex]}`;
      feedbackEl.classList.add("is-wrong");
    }

    attempts.push({
      module: q.module,
      text: q.text,
      chosen: q.options[idx],
      correct: q.options[q.correctIndex],
      isCorrect,
    });

    btnNext.disabled = false;
  }

  btnNext.addEventListener("click", () => {
    if (currentIndex < quizQuestions.length - 1) {
      currentIndex += 1;
      renderQuestion();
    } else {
      progressFill.style.width = "100%";
      finishQuiz();
    }
  });

  // ---------- results ----------
  function finishQuiz() {
    const total = quizQuestions.length;
    const pct = Math.round((score / total) * 100);
    finalScore.textContent = score;
    finalTotal.textContent = total;
    finalPct.textContent = `${pct}%`;
    finalRemark.textContent = remarkFor(pct);

    // per-module breakdown
    const byModule = {};
    attempts.forEach((a) => {
      byModule[a.module] = byModule[a.module] || { correct: 0, total: 0 };
      byModule[a.module].total += 1;
      if (a.isCorrect) byModule[a.module].correct += 1;
    });

    moduleBreakdown.innerHTML = "";
    Object.keys(byModule)
      .sort((a, b) => a - b)
      .forEach((mod) => {
        const { correct, total: t } = byModule[mod];
        const p = Math.round((correct / t) * 100);
        const row = document.createElement("div");
        row.className = "module-breakdown__row";
        row.innerHTML = `
          <span class="module-breakdown__name">${MODULE_SHORT_NAMES[mod]}</span>
          <span class="module-breakdown__track"><span class="module-breakdown__fill" style="width:${p}%"></span></span>
          <span class="module-breakdown__frac">${correct}/${t}</span>
        `;
        moduleBreakdown.appendChild(row);
      });

    buildReview();
    reviewList.hidden = true;
    btnReview.textContent = "Review Answers";
    showScreen("results");
  }

  function remarkFor(pct) {
    if (pct === 100) return "Full marks — the whole catalog, memorized.";
    if (pct >= 85) return "Excellent recall of the material.";
    if (pct >= 70) return "Solid grasp — a little more review will seal it.";
    if (pct >= 50) return "Getting there — revisit the weaker modules below.";
    return "Worth another pass through the modules before the exam.";
  }

  function buildReview() {
    reviewList.innerHTML = "";
    attempts.forEach((a, i) => {
      const item = document.createElement("div");
      item.className = `review-item ${a.isCorrect ? "is-correct" : "is-wrong"}`;
      item.innerHTML = `
        <p class="review-item__q">${i + 1}. ${escapeHTML(a.text)}</p>
        <p class="review-item__line ${a.isCorrect ? "correct-line" : "wrong-line"}">Your answer: <strong>${escapeHTML(a.chosen)}</strong></p>
        ${a.isCorrect ? "" : `<p class="review-item__line correct-line">Correct answer: <strong>${escapeHTML(a.correct)}</strong></p>`}
      `;
      reviewList.appendChild(item);
    });
  }

  btnReview.addEventListener("click", () => {
    const willShow = reviewList.hidden;
    reviewList.hidden = !willShow;
    btnReview.textContent = willShow ? "Hide Review" : "Review Answers";
  });

  btnRestart.addEventListener("click", () => {
    showScreen("setup");
  });
})();
