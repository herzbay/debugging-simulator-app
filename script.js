const codeSnippets = [
  {
    code: [
      "function greet(name) {",
      "  console.log('Hello ' + name);", // bug
      "  return name;",
      "}"
    ],
    bugIndex: 1,
  },
  {
    code: [
      "for (let i = 0; i < 5; i++) {", // bug (should be <=)
      "  console.log(i);",
      "}"
    ],
    bugIndex: 0,
  },
  {
    code: [
      "const arr = [1, 2, 3];",
      "arr.push(4);", // bug (change to pop)
      "console.log(arr);"
    ],
    bugIndex: 1,
  }
];

const messages = {
  en: {
    description: "Find the buggy line of code before time runs out!",
    correct: "✅ Correct! Bug found.",
    wrong: "❌ Wrong! Try again on the next snippet.",
    finish: (score) => `🎉 Game Over! Final Score: ${score}`,
    next: "Next ➡️",
    retry: "🔄 Retry",
    play: "▶️ Play"
  },
  id: {
    description: "Temukan baris kode yang salah sebelum waktu habis!",
    correct: "✅ Betul! Bug ditemukan.",
    wrong: "❌ Salah! Coba lagi di soal berikutnya.",
    finish: (score) => `🎉 Permainan selesai! Skor akhir: ${score}`,
    next: "Lanjutkan ➡️",
    retry: "🔄 Coba Lagi",
    play: "▶️ Main"
  }
};

let lang = "en";
let currentSnippet = 0;
let score = 0;
let timeLeft = 30;
let timerId;

const langSelect = document.getElementById("lang");
const descriptionEl = document.getElementById("description");
const nextBtn = document.getElementById("next-btn");
const retryBtn = document.getElementById("retry-btn");
const startBtn = document.getElementById("start-btn");
const codeSnippetEl = document.getElementById("code-snippet");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");

// Language switcher
langSelect.addEventListener("change", () => {
  lang = langSelect.value;
  descriptionEl.textContent = messages[lang].description;
  nextBtn.textContent = messages[lang].next;
  retryBtn.textContent = messages[lang].retry;
  startBtn.textContent = messages[lang].play;
});

function loadSnippet() {
  codeSnippetEl.innerHTML = "";
  resultEl.textContent = "";
  nextBtn.disabled = true;

  const snippet = codeSnippets[currentSnippet];
  snippet.code.forEach((line, idx) => {
    const lineEl = document.createElement("span");
    lineEl.textContent = line;
    lineEl.addEventListener("click", () => checkAnswer(idx));
    codeSnippetEl.appendChild(lineEl);
  });
}

function checkAnswer(selectedIndex) {
  const snippet = codeSnippets[currentSnippet];
  const lines = codeSnippetEl.querySelectorAll("span");

  if (selectedIndex === snippet.bugIndex) {
    lines[selectedIndex].classList.add("correct");
    resultEl.textContent = messages[lang].correct;
    score++;
  } else {
    lines[selectedIndex].classList.add("wrong");
    resultEl.textContent = messages[lang].wrong;
  }

  scoreEl.textContent = `💯 ${score}`;
  nextBtn.disabled = false;
}

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
  startGame();
});

startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  startGame();
});

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerEl.textContent = `⏱️ ${timeLeft}`;
    } else {
      clearInterval(timerId);
      endGame();
    }
  }, 1000);
}

function startGame() {
  score = 0;
  timeLeft = 30;
  currentSnippet = 0;
  scoreEl.textContent = `💯 ${score}`;
  timerEl.textContent = `⏱️ ${timeLeft}`;
  retryBtn.style.display = "none";
  nextBtn.style.display = "inline-block";

  loadSnippet();
  startTimer();
}

function resetGame() {
  score = 0;
  timeLeft = 30;
  currentSnippet = 0;
  scoreEl.textContent = `💯 ${score}`;
  timerEl.textContent = `⏱️ ${timeLeft}`;
  resultEl.textContent = "";
  retryBtn.style.display = "none";
  nextBtn.style.display = "inline-block";
}

function endGame() {
  clearInterval(timerId);
  codeSnippetEl.innerHTML = "";
  resultEl.textContent = messages[lang].finish(score);
  nextBtn.style.display = "none";
  retryBtn.style.display = "inline-block";
}
