/* ================= CONFIG ================= */
const INITIAL_TIME = 30; // seconds

/* ================ SNIPPETS ================ */
// Manual snippet
let codeSnippets = [
  {
    code: [
      "function greet(name) {",
      "  console.log('Hello ' + name);", // bug
      "  return name;",
      "}"
    ],
    bugIndex: 1
  },
  {
    code: [
      "for (let i = 0; i < 5; i++) {", // bug (should be <= 5)
      "  console.log(i);",
      "}"
    ],
    bugIndex: 0
  },
  {
    code: [
      "const arr = [1, 2, 3];",
      "arr.push(4);", // illustrative bug
      "console.log(arr);"
    ],
    bugIndex: 1
  }
];

/* Load AI-generated snippets from JSON file */
fetch("assets/snippets_ai.json")
  .then(res => res.json())
  .then(data => {
    codeSnippets = codeSnippets.concat(data);
  })
  .catch(err => console.error("Error loading AI snippets:", err));

/* ================= TEXTS (i18n) =============== */
const messages = {
  en: {
    subtitle: "Find, fix and improve — spot the buggy line fast!",
    howTitle: "ℹ️ How to Play",
    howto:
      "🔹 Click the line of code you think is buggy.<br>🔹 Correct = +1 score. Wrong = no points.<br>🔹 You start with 30s — get as many correct as possible.<br>🔹 Fastest time = (30 - remaining time) seconds.<br>🔹 Best score & fastest time saved in Leaderboard.",
    languageLabel: "🌐 Language",
    leaderboardTitle: "🏆 Leaderboard",
    bestScoreLabel: "Best Score:",
    bestTimeLabel: "Fastest Time:",
    play: "▶️ Play",
    next: "Next ➡️",
    retry: "🔄 Retry",
    correct: "✅ Correct! Bug found.",
    wrong: "❌ Wrong! Try the next snippet.",
    finish: (s, t) => `🎉 Game Over! Final Score: ${s} — Time used: ${t}s`
  },
  id: {
    subtitle: "Temukan, perbaiki — cari baris kode yang salah dengan cepat!",
    howTitle: "ℹ️ Cara Bermain",
    howto:
      "🔹 Klik baris kode yang menurutmu salah.<br>🔹 Benar = +1 skor. Salah = tidak mendapat poin.<br>🔹 Kamu mulai dengan 30 detik — dapatkan score setinggi mungkin.<br>🔹 Waktu tercepat = (30 - waktu tersisa) detik.<br>🔹 Skor terbaik & waktu tercepat disimpan di Leaderboard.",
    languageLabel: "🌐 Bahasa",
    leaderboardTitle: "🏆 Papan Skor",
    bestScoreLabel: "Skor Terbaik:",
    bestTimeLabel: "Waktu Tercepat:",
    play: "▶️ Main",
    next: "Lanjut ➡️",
    retry: "🔄 Coba Lagi",
    correct: "✅ Betul! Bug ditemukan.",
    wrong: "❌ Salah! Coba soal berikutnya.",
    finish: (s, t) => `🎉 Permainan selesai! Skor akhir: ${s} — Waktu: ${t}s`
  }
};

/* ================ STATE =================== */
let lang = "en";
let currentSnippet = 0;
let score = 0;
let timeLeft = INITIAL_TIME;
let timerId = null;

/* leaderboard state (localStorage) */
let bestScore = parseInt(localStorage.getItem("bestScore"), 10);
if (Number.isNaN(bestScore)) bestScore = 0;
let bestTime = localStorage.getItem("bestTime");
bestTime = bestTime !== null ? parseInt(bestTime, 10) : null;

/* ================ ELEMENTS ================= */
const subtitleEl = document.getElementById("subtitle");
const howTitleEl = document.getElementById("how-title");
const howtoEl = document.getElementById("howto");
const langLabelEl = document.getElementById("lang-label");
const langSelect = document.getElementById("lang");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const retryBtn = document.getElementById("retry-btn");

const timerEl = document.getElementById("timer");
const elapsedUsedEl = document.getElementById("elapsed-used");
const scoreEl = document.getElementById("score");
const codeSnippetEl = document.getElementById("code-snippet");
const resultEl = document.getElementById("result");

const leaderboardTitleEl = document.getElementById("leaderboard-title");
const bestScoreTextEl = document.getElementById("best-score-text");
const bestTimeTextEl = document.getElementById("best-time-text");
const bestScoreEl = document.getElementById("best-score");
const bestTimeEl = document.getElementById("best-time");

/* ================= INIT UI ================= */
function initUI() {
  subtitleEl.textContent = messages[lang].subtitle;
  howTitleEl.textContent = messages[lang].howTitle;
  howtoEl.innerHTML = messages[lang].howto;
  langLabelEl.textContent = messages[lang].languageLabel;
  startBtn.textContent = messages[lang].play;
  nextBtn.textContent = messages[lang].next;
  retryBtn.textContent = messages[lang].retry;
  leaderboardTitleEl.textContent = messages[lang].leaderboardTitle;

  bestScoreTextEl.innerHTML = `${messages[lang].bestScoreLabel} <strong id="best-score">${bestScore}</strong>`;
  bestTimeTextEl.innerHTML = `${messages[lang].bestTimeLabel} <strong id="best-time">${bestTime !== null ? bestTime : "--"}</strong>`;

  bestScoreEl.textContent = bestScore;
  bestTimeEl.textContent = bestTime !== null ? bestTime : "--";
  timerEl.textContent = `⏱️ ${INITIAL_TIME}s`;
  elapsedUsedEl.textContent = `⏳ 0s`;
  scoreEl.textContent = `💯 0`;

  nextBtn.style.display = "none";
  retryBtn.style.display = "none";
}
initUI();

/* ================ EVENTS ================== */
langSelect.addEventListener("change", () => {
  lang = langSelect.value;
  initUI();
});

startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  startGame();
});

nextBtn.addEventListener("click", () => {
  currentSnippet++;
  if (currentSnippet < codeSnippets.length) {
    loadSnippet();
  } else {
    endGame();
  }
});

retryBtn.addEventListener("click", () => {
  resetGame();
  startBtn.style.display = "inline-block";
  retryBtn.style.display = "none";
  nextBtn.style.display = "none";
});

/* ============== GAME FLOW ================= */
function loadSnippet() {
  codeSnippetEl.innerHTML = "";
  resultEl.textContent = "";
  nextBtn.disabled = true;
  nextBtn.style.display = "none";

  const snippet = codeSnippets[currentSnippet];
  snippet.code.forEach((line, idx) => {
    const span = document.createElement("span");
    span.textContent = line;
    span.style.userSelect = "none";
    span.addEventListener("click", () => checkAnswer(idx, span));
    codeSnippetEl.appendChild(span);
  });
}

function checkAnswer(selectedIndex, spanEl) {
  const snippet = codeSnippets[currentSnippet];

  if (selectedIndex === snippet.bugIndex) {
    spanEl.classList.add("correct");
    resultEl.textContent = messages[lang].correct;
    score++;
    setTimeout(() => spanEl.classList.remove("correct"), 700);
  } else {
    spanEl.classList.add("wrong");
    resultEl.textContent = messages[lang].wrong;
    setTimeout(() => spanEl.classList.remove("wrong"), 500);
  }

  scoreEl.textContent = `💯 ${score}`;
  nextBtn.style.display = "inline-block";
  nextBtn.disabled = false;
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = INITIAL_TIME;
  timerEl.textContent = `⏱️ ${timeLeft}s`;
  elapsedUsedEl.textContent = `⏳ 0s`;
  nextBtn.style.display = "none";
  nextBtn.disabled = true;
  retryBtn.style.display = "none";

  timerId = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerEl.textContent = `⏱️ ${timeLeft}s`;
      const used = INITIAL_TIME - timeLeft;
      elapsedUsedEl.textContent = `⏳ ${used}s`;
    } else {
      clearInterval(timerId);
      endGame();
    }
  }, 1000);
}

function startGame() {
  score = 0;
  currentSnippet = 0;
  scoreEl.textContent = `💯 ${score}`;
  loadSnippet();
  startTimer();
}

function resetGame() {
  clearInterval(timerId);
  score = 0;
  currentSnippet = 0;
  timeLeft = INITIAL_TIME;
  scoreEl.textContent = `💯 0`;
  timerEl.textContent = `⏱️ ${INITIAL_TIME}s`;
  elapsedUsedEl.textContent = `⏳ 0s`;
  resultEl.textContent = "";
  codeSnippetEl.innerHTML = "";
}

function endGame() {
  clearInterval(timerId);
  const used = INITIAL_TIME - timeLeft;
  codeSnippetEl.innerHTML = "";
  resultEl.textContent = messages[lang].finish(score, used);
  resultEl.style.textAlign = "center";

  nextBtn.style.display = "none";
  retryBtn.style.display = "inline-block";

  const shouldUpdate =
    score > bestScore ||
    (score === bestScore && (bestTime === null || used < bestTime));

  if (shouldUpdate) {
    bestScore = score;
    bestTime = used;
    localStorage.setItem("bestScore", String(bestScore));
    localStorage.setItem("bestTime", String(bestTime));
  }

  bestScoreEl.textContent = bestScore;
  bestTimeEl.textContent = bestTime !== null ? bestTime : "--";
}
