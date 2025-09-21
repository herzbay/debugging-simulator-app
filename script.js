const codeSnippets = [
  {
    code: [
      "function greet(name) {",
      "  console.log('Hello ' + name);",
      "  return name;",
      "}" 
    ],
    bugIndex: 1, 
    fixed: "  console.log('Hello, ' + name);"
  },
  {
    code: [
      "for (let i = 0; i < 5; i++) {",
      "  console.log(i);",
      "}" 
    ],
    bugIndex: 0,
    fixed: "for (let i = 0; i <= 5; i++) {"
  },
  {
    code: [
      "const arr = [1, 2, 3];",
      "arr.push(4);",
      "console.log(arr);" 
    ],
    bugIndex: 1,
    fixed: "arr.pop(4); // salah penggunaan pop()"
  }
];

const messages = {
  en: {
    description: "Find the buggy line of code before time runs out!",
    correct: "✅ Correct! Bug found.",
    wrong: "❌ Wrong! Try again on the next snippet.",
    finish: (score) => `🎉 Game Over! Final Score: ${score}`,
    next: "Next ➡️",
    retry: "🔄 Retry"
  },
  id: {
    description: "Temukan baris kode yang salah sebelum waktu habis!",
    correct: "✅ Betul! Bug ditemukan.",
    wrong: "❌ Salah! Coba lagi di soal berikutnya.",
    finish: (score) => `🎉 Permainan selesai! Skor akhir: ${score}`,
    next: "Lanjutkan ➡️",
    retry: "🔄 Coba Lagi"
  }
};

let lang = "en";
let currentSnippet = 0;
let score = 0;
let timeLeft = 30;
let timerId;

const codeSnippetEl = document.getElementById("code-snippet");
const resultEl = document.getElementById("result");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const langSelect = document.getElementById("lang");
const descriptionEl = document.getElementById("description");
const nextBtn = document.getElementById("next-btn");
const retryBtn = document.getElementById("retry-btn");

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

langSelect.addEventListener("change", () => {
  lang = langSelect.value;
  descriptionEl.textContent = messages[lang].description;
  nextBtn.textContent = messages[lang].next;
  retryBtn.textContent = messages[lang].retry;
});

retryBtn.addEventListener("click", () => {
  score = 0;
  timeLeft = 30;
  currentSnippet = 0;
  scoreEl.textContent = `💯 ${score}`;
  timerEl.textContent = `⏱️ ${timeLeft}`;
  retryBtn.style.display = "none";
  nextBtn.style.display = "inline-block";
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

function startTimer() {
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏱️ ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      endGame();
    }
  }, 1000);
}

function endGame() {
  codeSnippetEl.innerHTML = "";
  resultEl.textContent = messages[lang].finish(score);
  nextBtn.style.display = "none";
  retryBtn.style.display = "inline-block";
}

function startGame() {
  loadSnippet();
  startTimer();
}

startGame();