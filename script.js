let questions = [];
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let previousScore = null;
let totalQuestions = 0;

// Function to shuffle questions randomly
function shuffleQuestions() {
    shuffledQuestions = [...questions];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
}

// Function to show quiz page
function proceedToQuiz() {
    document.getElementById('opening-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
}

// Function to return to front page
function returnToHome() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('opening-container').style.display = 'block';
}

// File input event listener
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            parseQuestions(e.target.result);
        };
        reader.readAsText(file);
    }
});

// Function to parse questions from text file
function parseQuestions(text) {
    const blocks = text.split("\n\n"); // Split questions by blank lines
    questions = [];

    blocks.forEach(block => {
        const lines = block.split("\n").map(line => line.trim());
        let questionText = "";
        let options = [];
        let correctAnswer = "";
        let explanation = "No explanation provided.";

        lines.forEach(line => {
            if (/^question:/i.test(line)) {
                questionText = line.replace(/^question:\s*/i, "").trim();
            } else if (/^answer:/i.test(line)) {
                correctAnswer = line.replace(/^answer:\s*/i, "").trim().toUpperCase();
            } else if (/^explanation:/i.test(line)) {
                explanation = line.replace(/^explanation:\s*/i, "").trim();
            } else {
                const match = line.match(/^([A-D]|[a-d])[\)\.\-]?\s*(.*)/i);
                if (match) {
                    options.push(match[2]); // Extract option text
                }
            }
        });

        const answerIndex = options.findIndex(opt => opt.toLowerCase() === correctAnswer.toLowerCase());
        if (answerIndex !== -1) {
            correctAnswer = String.fromCharCode(65 + answerIndex);
        }

        if (questionText && options.length === 4 && correctAnswer) {
            questions.push({
                question: questionText,
                options: options,
                answer: correctAnswer,
                explanation: explanation
            });
        }
    });

    if (totalQuestions === 0) {
        totalQuestions = questions.length;
    }

    resetQuizState();
}

// Function to start quiz
function startQuiz() {
    if (questions.length === 0) {
        alert("Please upload a valid quiz file.");
        return;
    }

    currentQuestionIndex = 0;
    score = 0;

    // Randomize questions before starting
    shuffleQuestions();

    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';

    showQuestion();
}

// Function to display a question
function showQuestion() {
    if (currentQuestionIndex >= shuffledQuestions.length) {
        endQuiz();
        return;
    }

    const questionObj = shuffledQuestions[currentQuestionIndex];
    document.getElementById('question').innerText = questionObj.question;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = "";

    questionObj.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = `${String.fromCharCode(65 + index)}) ${option}`;
        button.onclick = () => checkAnswer(String.fromCharCode(65 + index), questionObj.answer, questionObj.explanation);
        optionsDiv.appendChild(button);
    });

    document.getElementById('endQuizBtn').style.display = 'block';
}

// Function to check answer
function checkAnswer(selected, correct, explanation) {
    let message = "";

    if (selected === correct) {
        score++;
        message = "✅ Correct!";
    } else {
        message = `❌ Wrong! The correct answer is: ${correct}`;
    }

    alert(message + "\n\n💡 Explanation: " + explanation);

    currentQuestionIndex++;
    showQuestion();
}

// Function to end the quiz
function endQuiz() {
    let improvementMessage = "";
    if (previousScore !== null) {
        let improvement = ((score - previousScore) / totalQuestions) * 100;
        improvementMessage = `<p>📈 You improved by <strong>${improvement.toFixed(2)}%</strong> compared to your last score!</p>`;
    }

    previousScore = score;

    document.getElementById('question-container').innerHTML = `
        <h2>Quiz Complete!</h2>
        <p>Your score: ${score} / ${totalQuestions}</p>
        ${improvementMessage}
        <button onclick="restartQuiz()">Restart Quiz</button>
        <button onclick="returnToHome()">Return to Home</button>
    `;
}

// Function to restart quiz properly
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;

    // Shuffle questions again for a new random order
    shuffleQuestions();

    document.getElementById('question-container').innerHTML = `
        <h2 id="question"></h2>
        <div id="options"></div>
        <button id="endQuizBtn" onclick="endQuiz()">End Quiz</button>
    `;

    showQuestion();
}

// Add alias to front page
document.addEventListener("DOMContentLoaded", function() {
    const aliasFooter = document.createElement('div');
    aliasFooter.innerHTML = "<p style='text-align: center; margin-top: 20px; font-size: 14px; color: gray;'>Created by Miguelito, RMT</p>";
    document.body.appendChild(aliasFooter);
});
