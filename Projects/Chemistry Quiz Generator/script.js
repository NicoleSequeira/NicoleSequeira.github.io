// Quiz app script
const startBtn = document.getElementById('startQuiz');
const mainBox = document.querySelector('.main-box');
const quizTitle = document.querySelector('.quiz-title');
let quizContainer = null;
let questionText = null;
let choicesDiv = null;
let nextButton = null;
const quizCounter = document.getElementById('quizCounter');

let allQuestions = [];
let quizQuestions = [];
let currentIndex = 0;
let selectedChoice = null;
let userAnswers = []; // Track user's answers

// Load questions JSON
async function loadQuestions() {
	try {
		const res = await fetch('./Questions.json');
		const data = await res.json();
		allQuestions = data;
	} catch (e) {
		console.error('Failed to load questions.json', e);
		allQuestions = [];
	}
}

// Create quiz container and add to DOM
function createQuizContainer() {
	// Remove existing quiz container if it exists
	if (quizContainer) {
		quizContainer.remove();
	}

	// Create new quiz container
	quizContainer = document.createElement('div');
	quizContainer.className = 'quiz-container';
	quizContainer.id = 'quizContainer';

	quizContainer.innerHTML = `
		<div class="quiz-card">
			<div class="question-text" id="questionText">Question will appear here</div>
			<div class="choices" id="choices">
				<!-- choices inserted here -->
			</div>
			<div class="quiz-actions">
				<button id="nextButton" class="next-button">Next</button>
			</div>
		</div>
	`;

	// Insert after main-box
	mainBox.insertAdjacentElement('afterend', quizContainer);

	// Update references to elements
	questionText = document.getElementById('questionText');
	choicesDiv = document.getElementById('choices');
	nextButton = document.getElementById('nextButton');

	// Add event listener to next button
	nextButton.addEventListener('click', () => {
		// Store the user's answer (or null if no selection)
		const currentQuestion = quizQuestions[currentIndex];
		const userAnswer = selectedChoice !== null ? currentQuestion.choices[selectedChoice] : null;
		userAnswers.push({
			question: currentQuestion.question,
			userAnswer: userAnswer,
			correctAnswer: currentQuestion.answer,
			isCorrect: userAnswer === currentQuestion.answer
		});

		if (currentIndex < quizQuestions.length - 1) {
			currentIndex += 1;
			renderQuestion();
			updateCounter();
		} else {
			// finished
			showResults();
		}
	});
}

function startQuiz() {
	const countSelect = document.getElementById('questionCount');
	const count = parseInt(countSelect.value, 10) || 5;

	// simple shuffle and take first N
	const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
	quizQuestions = shuffled.slice(0, Math.min(count, shuffled.length));
	currentIndex = 0;
	userAnswers = []; // Reset user answers

	// create and show quiz UI
	createQuizContainer();
	mainBox.classList.add('hidden');
	quizTitle.classList.add('quiz-active');
	quizCounter.classList.remove('hidden');
	updateCounter();
	renderQuestion();
}

function renderQuestion() {
	selectedChoice = null;
	const q = quizQuestions[currentIndex];
	if (!q) return;
	questionText.textContent = q.question;
	choicesDiv.innerHTML = '';

	q.choices.forEach((choiceText, idx) => {
		const btn = document.createElement('div');
		btn.className = 'choice';
		btn.tabIndex = 0;
		btn.textContent = choiceText;
		btn.addEventListener('click', () => selectChoice(btn, idx));
		btn.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') selectChoice(btn, idx);
		});
		choicesDiv.appendChild(btn);
	});

	// update next button text
	nextButton.textContent = (currentIndex === quizQuestions.length - 1) ? 'Finish' : 'Next';
}

function selectChoice(elem, idx) {
	// clear previous
	const prev = choicesDiv.querySelector('.choice.selected');
	if (prev) prev.classList.remove('selected');
	elem.classList.add('selected');
	selectedChoice = idx;
}

function updateCounter() {
	const left = quizQuestions.length - currentIndex - 1;
	quizCounter.textContent = `Question ${currentIndex + 1} of ${quizQuestions.length} — ${left} left`;
}

function showResults() {
	// Calculate score
	const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
	const totalQuestions = userAnswers.length;
	const percentage = Math.round((correctAnswers / totalQuestions) * 100);

	// Get incorrect answers
	const incorrectAnswers = userAnswers.filter(answer => !answer.isCorrect);

	// Build results HTML
	let resultsHTML = `
		<div class="quiz-card results-card">
			<h3>Quiz Results</h3>
			<div class="score-summary">
				<p class="score-text">You got <strong>${correctAnswers}</strong> out of <strong>${totalQuestions}</strong> questions correct!</p>
				<p class="percentage-text">Score: <strong>${percentage}%</strong></p>
			</div>
	`;

	// Add incorrect answers section if there are any
	if (incorrectAnswers.length > 0) {
		resultsHTML += `
			<div class="incorrect-answers">
				<h4>Questions You Got Wrong:</h4>
		`;

		incorrectAnswers.forEach((answer) => {
			resultsHTML += `
				<div class="incorrect-item">
					<p class="question-review"><strong>Q:</strong> ${answer.question}</p>
					<p class="your-answer"><strong>Your Answer:</strong> ${answer.userAnswer || 'No answer selected'}</p>
					<p class="correct-answer"><strong>Correct Answer:</strong> ${answer.correctAnswer}</p>
				</div>
			`;
		});

		resultsHTML += `</div>`;
	} else {
		resultsHTML += `<div class="perfect-score"><p>🎉 Perfect score! You got all questions correct!</p></div>`;
	}

	resultsHTML += `
			<button id="restartBtn" class="next-button">Take Another Quiz</button>
		</div>
	`;

	quizContainer.innerHTML = resultsHTML;

	document.getElementById('restartBtn').addEventListener('click', () => {
		// reset - remove quiz container from DOM
		if (quizContainer) {
			quizContainer.remove();
			quizContainer = null;
		}
		mainBox.classList.remove('hidden');
		quizTitle.classList.remove('quiz-active');
		quizCounter.textContent = '';
		quizCounter.classList.add('hidden');
	});
}

// wire start
startBtn.addEventListener('click', async () => {
	if (!allQuestions.length) await loadQuestions();
	if (!allQuestions.length) {
		alert('No questions available.');
		return;
	}
	startQuiz();
});

// preload questions
loadQuestions();
