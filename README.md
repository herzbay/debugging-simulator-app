# 🕵️ Code Debugging Simulator

---

## 📖 Description
**Code Debugging Simulator** is a small interactive mini-game where players must **find buggy lines in JavaScript code** under a time limit.  
This project was developed as part of a capstone assignment to demonstrate **code generation and optimization** combined with **AI support from IBM Granite via Replicate Playground**.  
It aims to provide a fun and educational way to practice debugging skills while showing how AI can contribute to generating code challenges.

---

## 🛠️ Technologies Used
- **HTML5** → Structure and layout  
- **CSS3** → Styling, dark theme, animations  
- **JavaScript (ES6)** → Game logic and interactivity  
- **LocalStorage** → Save best score and fastest solving time (Leaderboard)  
- **IBM Granite-3.3-8B-Instruct (via Replicate)** → AI-generated buggy code snippets  

---

## ✨ Features
- ⏱️ **Timer**: 30 seconds to solve as many snippets as possible.  
- 💯 **Scoring system**: Gain points for correctly identifying buggy lines.  
- 🏆 **Leaderboard**: Saves best score and fastest solving time locally.  
- 🌍 **Multi-language support**: English 🇬🇧 and Bahasa Indonesia 🇮🇩.  
- 🎨 **UI/UX**: Clean dark theme, responsive layout, glowing & shake animations for correct/wrong answers.  
- 🤖 **AI-powered challenges**: Some buggy code snippets were generated with IBM Granite AI.  

---

## ⚙️ Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/herzbay/debugging-simulator-app
   cd code-debugging-simulator
2. Open the project in your editor (e.g., VSCode).  
3. Launch the app by opening **`index.html`** in a browser, or run with the **Live Server** extension in VSCode for auto-refresh.  
4. Click **▶️ Play** and start finding the buggy lines!  

---

## 🤖 AI Support Explanation
This project integrates **AI-generated buggy code snippets** using **IBM Granite** via [Replicate Playground](https://replicate.com).

### 🔹 Prompt used
Generate a JavaScript code snippet with exactly one bug. 
Output in JSON with fields "code" (array of strings) and "bugIndex" (integer).

### 🔹 Output from Granite
Here's a JavaScript code snippet with a bug and the requested JSON output:

```json
{
  "code": [
    "let arr = [1, 2, 3, 4, 5];",
    "let sum = 0;",
    "for (let i = 0; i <= arr.length; i++) {",
    "  sum += arr[i];",
    "}",
    "console.log(sum);"
  ],
  "bugIndex": 4
}
```

The bug is in the for loop condition: `i <= arr.length`. It should be `i < arr.length` to avoid an "undefined" error when trying to access `arr[arr.length]`. The bugIndex points to the line number where the bug resides (0-indexed).

Please note that the bugIndex is 4 because it refers to the line containing the closing bracket of the for loop, not the line with the buggy condition.

### 🔹 How it’s used
- The JSON outputs from Granite Playground are saved in assets/snippets_ai.json.
- The game’s script.js fetches and merges these AI-generated snippets with manually created ones.
- This allows players to experience a mix of hand-crafted and AI-generated debugging challenges.

## 📸 Screenshots

## 🎯 Purpose
- Train your eye for debugging common JavaScript mistakes.
- Showcase how AI models like IBM Granite can assist in creating educational tools.
- Deliver a simple but engaging capstone project combining programming and AI.

## ❤️ Credits
Built with love by Herzbay