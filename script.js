let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let previousScore = null;
let totalQuestions = 0;

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
    const lines = text.split("\n").map(line => line.trim()).filter(line => line !== "");
    questions = [];

    for (let i = 0; i < lines.length; i += 7) {
        if (i + 6 < lines.length) { // Ensure a full question set
            questions.push({
                question: lines[i],
                options: [lines[i + 1], lines[i + 2], lines[i + 3], lines[i + 4]],
                answer: lines[i + 5].toUpperCase(),
                explanation: lines[i + 6] || "No explanation provided."
            });
        }
    }

    if (totalQuestions === 0) {
        totalQuestions = questions.length;
        resetQuizState();
    }
}

// Function to start quiz
function startQuiz() {
    if (questions.length === 0) {
        alert("Please upload a valid quiz file.");
        return;
    }

    currentQuestionIndex = 0;
    score = 0;

    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('question-container').style.display = 'block';

    showQuestion();
}

// Function to display a question
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    const questionObj = questions[currentQuestionIndex];
    document.getElementById('question').innerText = questionObj.question;

    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ""; // Clear previous options

    questionObj.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = `${String.fromCharCode(65 + index)}) ${option}`;
        button.onclick = () => checkAnswer(String.fromCharCode(65 + index), questionObj.answer, questionObj.explanation);
        optionsDiv.appendChild(button);
    });

    // Ensure "End Quiz" button is visible
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

    previousScore = score; // Store score for next attempt

    document.getElementById('question-container').innerHTML = `
        <h2>Quiz Complete!</h2>
        <p>Your score: ${score} / ${totalQuestions}</p>
        ${improvementMessage}
        <p><strong>Note:</strong> If the page is refreshed or restarted, the previous score will not be stored.</p>
        <button onclick="restartQuiz()">Restart Quiz</button>
        <button onclick="returnToHome()">Return to Home</button>
    `;
}

// Function to restart quiz properly
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;

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
