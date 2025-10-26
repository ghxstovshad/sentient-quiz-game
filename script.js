// --- Game Data: True/False Statements ---
// Structure: { statement: "The statement to display", isCorrect: boolean }
const SENTIENT_TF_DATA = [
    // TRUE Statements (Based on whitepaper/website)
    { 
        statement: "Sentient's primary mission is to ensure Artificial General Intelligence (AGI) is open-source and not controlled by a single entity.", 
        isCorrect: true 
    },
    { 
        statement: "The GRID is the largest open intelligence network where 100+ models, agents, and tools operate as one unified system.", 
        isCorrect: true 
    },
    { 
        statement: "ROMA is an open-source framework for multi-agent systems that splits big goals into subtasks for long-horizon reasoning.", 
        isCorrect: true 
    },
    { 
        statement: "Dobby is the world's first fingerprinted AI model, explicitly aligned with pro-crypto and pro-freedom values.", 
        isCorrect: true 
    },
    { 
        statement: "Fingerprinting refers to a cryptographic library that embeds undetectable, verifiable signatures into AI models for ownership tracking.", 
        isCorrect: true 
    },
    { 
        statement: "The Open Deep Search tool utilizes reasoning agents and a novel search component to augment open-source LLMs.", 
        isCorrect: true 
    },
    { 
        statement: "Sentient Chat is an open AI platform for users to experience GRID artifacts, try open-source repos, and give feedback.", 
        isCorrect: true 
    },
    { 
        statement: "Sentient believes that releasing all breakthroughs open-source proves that openness will outpace closed labs at every step.", 
        isCorrect: true 
    },
    { 
        statement: "Key research areas for the Sentient team include Agentic safety, post-training, and model security.", 
        isCorrect: true 
    },
    { 
        statement: "Sentient's custom Benchmarks cover specific domains like fair coding, crypto values, and governance.", 
        isCorrect: true 
    },

    // FALSE Statements (Incorrect facts based on whitepaper/website)
    { 
        statement: "Sentient's primary mission is to solely build and monetize a highly performant, proprietary Large Language Model (LLM).", 
        isCorrect: false 
    },
    { 
        statement: "The GRID is a custom hardware accelerator developed by Sentient to speed up model training.", 
        isCorrect: false 
    },
    { 
        statement: "ROMA is the name of the blockchain token used to fund the Sentient ecosystem.", 
        isCorrect: false 
    },
    { 
        statement: "Dobby is a closed-source model that requires a subscription for commercial use.", 
        isCorrect: false 
    },
    { 
        statement: "Fingerprinting is a new form of biometric security used to restrict network access.", 
        isCorrect: false 
    },
    { 
        statement: "The Open Deep Search relies on a proprietary, centralized database of indexed web content to find answers.", 
        isCorrect: false 
    },
    { 
        statement: "Sentient Chat is exclusively a private, encrypted channel for the core developer team.", 
        isCorrect: false 
    },
    { 
        statement: "Sentient argues that the decentralized approach is slower but safer than development by closed labs.", 
        isCorrect: false 
    },
    { 
        statement: "Key research areas for the Sentient team include fusion energy and quantum computing hardware.", 
        isCorrect: false 
    },
    { 
        statement: "Sentient's Benchmarks focus only on speed and computational efficiency, ignoring ethical alignment.", 
        isCorrect: false 
    }
];

// --- Image Paths for Mascots ---
// UPDATED: new-image is the crying mascot (Incorrect)
const INCORRECT_MASCOT_IMAGE = 'new-image.jpg'; 
// UPDATED: my-image is the happy/thumbs up mascot (Correct)
const CORRECT_MASCOT_IMAGE = 'my-image.jpg'; 

// --- DOM Elements ---
const statementText = document.getElementById('statement-text');
const messageDisplay = document.getElementById('message-display');
const timerDisplay = document.getElementById('timer-display');
const questionCountDisplay = document.getElementById('question-count');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const answerButtonsDiv = document.getElementById('answer-buttons');
const trueButton = document.getElementById('true-button');
const falseButton = document.getElementById('false-button');
const finalScoreDiv = document.getElementById('final-score');
const finalTimeDisplay = document.getElementById('final-time');
const finalFeedbackDisplay = document.getElementById('final-feedback');
const statementCard = document.getElementById('statement-card');
const feedbackMascot = document.getElementById('feedback-mascot'); 

// --- Game State Variables ---
let currentQuiz = []; 
let currentQuestionIndex = 0;
let startTime = 0;
let timerInterval;
const MAX_QUESTIONS = 10;
let isGameActive = false;

// --- Utility Functions (Omitted for brevity, but remain unchanged from previous script.js) ---
function shuffleArray(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function generateQuiz() {
    const trueStatements = SENTIENT_TF_DATA.filter(q => q.isCorrect === true);
    const falseStatements = SENTIENT_TF_DATA.filter(q => q.isCorrect === false);
    
    const shuffledTrue = shuffleArray(trueStatements).slice(0, 5);
    const shuffledFalse = shuffleArray(falseStatements).slice(0, 5);

    const finalQuiz = [...shuffledTrue, ...shuffledFalse];
    return shuffleArray(finalQuiz);
}
// --- End Utility Functions ---


/**
 * Starts the game.
 */
function startGame() {
    if (isGameActive) return;
    
    // Reset state
    currentQuiz = generateQuiz();
    currentQuestionIndex = 0;
    isGameActive = true;
    
    // UI setup
    startButton.classList.add('hidden');
    resetButton.classList.add('hidden');
    finalScoreDiv.classList.add('hidden');
    answerButtonsDiv.classList.remove('hidden');
    statementCard.classList.remove('correct-feedback', 'incorrect-feedback');
    feedbackMascot.classList.add('hidden'); 
    messageDisplay.textContent = "Answer quickly to secure a fast time!";
    statementText.textContent = ""; 

    // Start Timer
    startTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 100);

    loadNextQuestion();
}

/**
 * Loads the next statement into the display.
 */
function loadNextQuestion() {
    if (currentQuestionIndex >= MAX_QUESTIONS) {
        endGame();
        return;
    }

    const question = currentQuiz[currentQuestionIndex];
    statementText.textContent = question.statement;
    questionCountDisplay.textContent = `Question: ${currentQuestionIndex + 1} / ${MAX_QUESTIONS}`;
    
    // Re-enable buttons and clear card feedback and hide mascot
    trueButton.disabled = false;
    falseButton.disabled = false;
    statementCard.classList.remove('correct-feedback', 'incorrect-feedback');
    feedbackMascot.classList.remove('visible'); // Ensure it transitions out
    setTimeout(() => {
        feedbackMascot.classList.add('hidden'); // Hide completely after transition
    }, 300); // Matches CSS transition time
}

/**
 * Handles the user's answer (True or False).
 * @param {boolean} userGuess - The user's choice (true for 'TRUE', false for 'FALSE').
 */
function handleAnswer(userGuess) {
    if (!isGameActive) return;

    const question = currentQuiz[currentQuestionIndex];
    const isCorrect = userGuess === question.isCorrect;

    // Disable buttons while providing feedback
    trueButton.disabled = true;
    falseButton.disabled = true;

    if (isCorrect) {
        statementCard.classList.add('correct-feedback');
        messageDisplay.textContent = "✅ Correct! Great job!";
        feedbackMascot.src = CORRECT_MASCOT_IMAGE;
    } else {
        statementCard.classList.add('incorrect-feedback');
        messageDisplay.textContent = "❌ Incorrect! Check the whitepaper!";
        feedbackMascot.src = INCORRECT_MASCOT_IMAGE;
    }
    
    feedbackMascot.classList.remove('hidden');
    feedbackMascot.classList.add('visible');

    // Move to the next question after a brief delay
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < MAX_QUESTIONS) {
            messageDisplay.textContent = "Answer quickly to secure a fast time!";
            loadNextQuestion();
        } else {
            endGame();
        }
    }, 1200); 
}

/**
 * Stops the timer and shows final score.
 */
function endGame() {
    isGameActive = false;
    clearInterval(timerInterval);
    answerButtonsDiv.classList.add('hidden');
    statementText.textContent = "";
    messageDisplay.textContent = "Quiz finished!";
    resetButton.classList.remove('hidden');
    finalScoreDiv.classList.remove('hidden');
    feedbackMascot.classList.add('hidden'); 

    const finalTimeSeconds = (Date.now() - startTime) / 1000;
    finalTimeDisplay.textContent = `Total Time: ${finalTimeSeconds.toFixed(2)}s`;

    let feedbackMessage = "";
    if (finalTimeSeconds < 30) {
        feedbackMessage = "🤯 You're a SentientAGI expert! That was fast!";
    } else if (finalTimeSeconds < 50) {
        feedbackMessage = "🚀 Great knowledge! Keep it up!";
    } else {
        feedbackMessage = "📚 Good effort! Time to review the whitepaper!";
    }
    finalFeedbackDisplay.textContent = feedbackMessage;
}

/**
 * Updates the timer display.
 */
function updateTimer() {
    if (isGameActive) {
        const elapsed = (Date.now() - startTime) / 1000;
        timerDisplay.textContent = `Time: ${elapsed.toFixed(1)}s`;
    }
}

// --- Event Listeners ---
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', startGame);

trueButton.addEventListener('click', () => handleAnswer(true));
falseButton.addEventListener('click', () => handleAnswer(false));

// Initialize the game view on load
document.addEventListener('DOMContentLoaded', () => {
    questionCountDisplay.textContent = `Question: 0 / ${MAX_QUESTIONS}`;
    timerDisplay.textContent = "Time: 0.0s";
    feedbackMascot.classList.add('hidden'); 
});