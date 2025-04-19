<h2>Mauricio Meza - Code Test Submission</h2>

Submission deployed here: https://mauriciomeza.github.io/quiz-challenge/

Lightweight, framework-free quiz web app built using only **HTML**, **CSS**, and **vanilla JavaScript**

- Implemented a small Three.js 3D companion to give feedback and help you (or not) while answering questions.
- Questions can be dinamically loaded from QuizAPI.io, if API not configured it loads questions from data.js
- To configure API create a file called env.js in ./src/ folder and set it like this to configure key, category, difficulty and numer of questions:
```
const CONFIG = {
    API_KEY: "YOURAPIKEY",
    BASE_URL: "https://quizapi.io/api/v1/questions?",
    CONFIG: "&category=html&difficulty=Medium&limit=10"
};
```

