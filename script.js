// ILS212 Test/Quiz for Covenant Generals — app logic
// Depends on QUESTIONS (questions.js) and PAST_QUESTIONS (pastQuestions.js)

const BANKS = {
  practice: {
    label: "Practice Bank",
    sub: "200 questions · full course review, Modules 1–5",
    data: QUESTIONS
  },
  past: {
    label: "Past Questions",
    sub: "CA Test · 20 questions from the FUTO continuous assessment paper",
    data: PAST_QUESTIONS
  }
};

let currentBankKey = 'practice';
let selectedCount = 15;
let sessionQuestions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let userAnswers = [];

const setupScreen = document.getElementById('setup-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const bankOptionsEl = document.getElementById('bank-options');
const bankNote = document.getElementById('bank-note');
const countOptionsEl = document.getElementById('count-options');
const deckNote = document.getElementById('deck-note');
const startBtn = document.getElementById('start-btn');

// ---- Bank switcher ----
Object.keys(BANKS).forEach(key => {
  const bank = BANKS[key];
  const btn = document.createElement('button');
  btn.className = 'bank-btn' + (key === currentBankKey ? ' active' : '');
  btn.innerHTML = `<strong>${bank.label}</strong>${bank.sub}`;
  btn.addEventListener('click', () => {
    currentBankKey = key;
    document.querySelectorAll('.bank-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateBankNote();
    renderCountOptions();
  });
  bankOptionsEl.appendChild(btn);
});

function updateBankNote() {
  bankNote.textContent = `Selected: ${BANKS[currentBankKey].label} — ${BANKS[currentBankKey].data.length} cards in this drawer.`;
}

// ---- Count selector (rebuilt whenever the bank changes) ----
function renderCountOptions() {
  const total = BANKS[currentBankKey].data.length;
  const raw = [5, 10, 15, 20, 30, 50, total];
  const choices = [...new Set(raw.filter(n => n <= total && n > 0))];
  if (!choices.includes(total)) choices.push(total);

  selectedCount = choices.includes(15) ? 15 : choices[Math.floor(choices.length / 2)];

  countOptionsEl.innerHTML = '';
  choices.forEach(n => {
    const btn = document.createElement('button');
    btn.className = 'count-btn' + (n === selectedCount ? ' active' : '');
    btn.textContent = n === total ? `All (${n})` : n;
    btn.addEventListener('click', () => {
      selectedCount = n;
      countOptionsEl.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateDeckNote();
    });
    countOptionsEl.appendChild(btn);
  });
  updateDeckNote();
}

function updateDeckNote() {
  deckNote.textContent = `${selectedCount} of ${BANKS[currentBankKey].data.length} cards will be drawn at random from ${BANKS[currentBankKey].label}.`;
}

updateBankNote();
renderCountOptions();

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

startBtn.addEventListener('click', () => {
  const pool = BANKS[currentBankKey].data;
  sessionQuestions = shuffle(pool).slice(0, selectedCount);
  currentIndex = 0;
  score = 0;
  userAnswers = [];
  setupScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  resultsScreen.classList.add('hidden');
  renderQuestion();
});

const qnumLabel = document.getElementById('qnum-label');
const scoreLabel = document.getElementById('score-label');
const progressFill = document.getElementById('progress-fill');
const moduleTag = document.getElementById('module-tag');
const questionText = document.getElementById('question-text');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');

function renderQuestion() {
  answered = false;
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  nextBtn.classList.remove('show');

  const item = sessionQuestions[currentIndex];
  qnumLabel.textContent = `Card ${currentIndex + 1} of ${sessionQuestions.length}`;
  scoreLabel.textContent = `Score: ${score}`;
  progressFill.style.width = `${(currentIndex / sessionQuestions.length) * 100}%`;
  moduleTag.textContent = item.m;
  questionText.textContent = item.q;

  optionsEl.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  item.options.forEach((opt, idx) => {
    const div = document.createElement('button');
    div.className = 'option';
    div.innerHTML = `<span class="letter">${letters[idx]}</span><span>${opt}</span>`;
    div.addEventListener('click', () => selectAnswer(idx));
    optionsEl.appendChild(div);
  });
}

function selectAnswer(idx) {
  if (answered) return;
  answered = true;
  const item = sessionQuestions[currentIndex];
  const optionEls = optionsEl.querySelectorAll('.option');
  optionEls.forEach(el => el.classList.add('locked'));

  const wasRight = idx === item.correct;
  if (wasRight) {
    score++;
    optionEls[idx].classList.add('correct');
    feedbackEl.textContent = 'Correct. Filed accurately.';
    feedbackEl.classList.add('right');
  } else {
    optionEls[idx].classList.add('incorrect');
    optionEls[item.correct].classList.add('correct');
    feedbackEl.textContent = `Not quite — correct answer: ${item.options[item.correct]}`;
    feedbackEl.classList.add('wrong');
  }

  userAnswers.push({
    q: item.q,
    chosen: item.options[idx],
    correctAns: item.options[item.correct],
    wasRight: wasRight
  });

  scoreLabel.textContent = `Score: ${score}`;
  nextBtn.classList.add('show');
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex >= sessionQuestions.length) {
    showResults();
  } else {
    renderQuestion();
  }
});

const finalScore = document.getElementById('final-score');
const finalPct = document.getElementById('final-pct');
const ratingText = document.getElementById('rating-text');
const reviewBtn = document.getElementById('review-btn');
const retryBtn = document.getElementById('retry-btn');
const reviewList = document.getElementById('review-list');

function showResults() {
  quizScreen.classList.add('hidden');
  resultsScreen.classList.remove('hidden');
  reviewList.classList.add('hidden');
  reviewList.innerHTML = '';

  progressFill.style.width = '100%';
  const total = sessionQuestions.length;
  const pct = Math.round((score / total) * 100);
  finalScore.textContent = `${score} / ${total}`;
  finalPct.textContent = `${pct}% correct — ${BANKS[currentBankKey].label}`;

  let rating;
  if (pct === 100) rating = 'Master Cataloguer — flawless retrieval.';
  else if (pct >= 80) rating = 'Well-Indexed — strong command of the material.';
  else if (pct >= 60) rating = 'Reader in Training — solid, keep reviewing.';
  else if (pct >= 40) rating = 'Needs Reshelving — revisit the modules.';
  else rating = 'Start at the Catalogue Desk — begin again from Module 1.';
  ratingText.textContent = rating;

  userAnswers.forEach(a => {
    const div = document.createElement('div');
    div.className = 'review-item ' + (a.wasRight ? 'ok' : 'bad');
    div.innerHTML = `<div class="rq">${a.q}</div>` +
      (a.wasRight
        ? `<div class="ra-right">Your answer: ${a.chosen}</div>`
        : `<div class="ra-wrong">Your answer: ${a.chosen} — Correct: ${a.correctAns}</div>`);
    reviewList.appendChild(div);
  });
}

reviewBtn.addEventListener('click', () => {
  reviewList.classList.toggle('hidden');
  reviewBtn.textContent = reviewList.classList.contains('hidden') ? 'Review Answers' : 'Hide Review';
});

retryBtn.addEventListener('click', () => {
  resultsScreen.classList.add('hidden');
  setupScreen.classList.remove('hidden');
  reviewBtn.textContent = 'Review Answers';
});
