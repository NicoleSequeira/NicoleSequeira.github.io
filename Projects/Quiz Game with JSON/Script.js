// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('start-btn');
    const mainPage = document.getElementById('main-page');
    const quizContainer = document.getElementById('quiz-container');
    const usernameInput = document.getElementById('username');
    const leaderboardList = document.getElementById('leaderboard-list');
    const clearLeaderboardBtn = document.getElementById('clear-leaderboard-btn');
    let questions = [];
    let currentQuestion = 0;
    let selected = false;
    let username = '';
    let score = 0;
    let startTime = 0;
    let endTime = 0;

    // Hide quiz container initially
    quizContainer.style.display = 'none';

    // Load leaderboard on page load
    loadLeaderboard();

    startBtn.addEventListener('click', function() {
        username = usernameInput.value.trim();
        if (!username) {
            alert('Please enter your name before starting the quiz!');
            usernameInput.focus();
            return;
        }
        // Hide main page
        mainPage.style.display = 'none';

        // Show quiz container
        quizContainer.style.display = 'flex';

        // Reset score
        score = 0;
        startTime = Date.now();

        // Fetch and display questions
        fetch('Data/Questions.json')
            .then(response => response.json())
            .then(data => {
                questions = data.questions;
                currentQuestion = 0;
                showQuestion();
            })
            .catch(error => {
                quizContainer.innerText = 'Could not load questions.';
                console.error(error);
            });
    });

    function showQuestion() {
        selected = false;
        quizContainer.innerHTML = '';
        if (currentQuestion >= questions.length) {
            endTime = Date.now();
            showResults();
            return;
        }
        const q = questions[currentQuestion];

        // Question text
        const questionText = document.createElement('h3');
        questionText.textContent = `Q${currentQuestion + 1}: ${q.text}`;
        questionText.style.marginBottom = '20px';

        // Answer box
        const answerBox = document.createElement('div');
        answerBox.className = 'question-block';

        // Answer buttons
        q.options.forEach((opt) => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.style.display = 'block';
            btn.style.margin = '10px auto';
            btn.style.width = '80%';
            btn.style.fontSize = '1em';
            btn.onclick = function() {
                if (selected) return;
                selected = true;
                if (opt === q.answer) {
                    btn.style.background = '#b6e2d3';
                    showResult('Correct!');
                    score++;
                } else {
                    btn.style.background = '#f9bed0';
                    showResult('Incorrect!');
                }
                showNextButton();
            };
            answerBox.appendChild(btn);
        });

        quizContainer.appendChild(questionText);
        quizContainer.appendChild(answerBox);

        // Result message
        function showResult(msg) {
            const result = document.createElement('div');
            result.textContent = msg;
            result.style.marginTop = '16px';
            result.style.fontWeight = 'bold';
            result.style.color = msg === 'Correct!' ? '#2ecc71' : '#e74c3c';
            answerBox.appendChild(result);
        }

        // Next button
        function showNextButton() {
            const nextBtn = document.createElement('button');
            nextBtn.textContent = currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz';
            nextBtn.style.marginTop = '24px';
            nextBtn.style.background = '#FBACBE';
            nextBtn.style.color = '#fff';
            nextBtn.style.borderRadius = '8px';
            nextBtn.style.padding = '10px 24px';
            nextBtn.style.fontSize = '1em';
            nextBtn.onclick = function() {
                currentQuestion++;
                showQuestion();
            };
            answerBox.appendChild(nextBtn);
        }
    }

    function showResults() {
        const timeTaken = Math.round((endTime - startTime) / 1000); // seconds
        saveToLeaderboard(username, score, questions.length, timeTaken);

        quizContainer.innerHTML = `
            <div class="question-block">
                <h2>Quiz Complete!</h2>
                <p>Thank you for playing, ${username}!</p>
                <p>You got <strong>${score}</strong> out of <strong>${questions.length}</strong> correct.</p>
                <p>Time taken: <strong>${timeTaken}</strong> seconds</p>
                <button id="return-btn">Return to Main Page</button>
            </div>
        `;
        document.getElementById('return-btn').onclick = function() {
            quizContainer.style.display = 'none';
            mainPage.style.display = 'flex';
            usernameInput.value = '';
        };
        loadLeaderboard();
    }

    function saveToLeaderboard(name, score, total, time) {
        let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({
            name: name,
            score: score,
            total: total,
            time: time,
            date: new Date().toLocaleString()
        });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }

    function loadLeaderboard() {
        let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboardList.innerHTML = '';
        leaderboard.slice(-10).reverse().forEach(entry => {
            const li = document.createElement('li');
            li.innerHTML = `<span><strong>${entry.name}</strong></span>
                <span>${entry.score}/${entry.total} correct</span>
                <span>${entry.time}s</span>`;
            leaderboardList.appendChild(li);
        });
    }

    clearLeaderboardBtn.addEventListener('click', function() {
        if (confirm('Clear all leaderboard history?')) {
            localStorage.removeItem('leaderboard');
            loadLeaderboard();
        }
    });
});