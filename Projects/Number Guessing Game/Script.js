const guessCountSpan = document.getElementById('guessCount');
const guessHistoryList = document.getElementById('guessHistory');
let guessCount = 0;
let guessHistory = [];
let min = 1;
let max = 100;
let randomNumber;
const playAgainButton = document.getElementById('playAgainButton');
const guessInputDiv = document.querySelector('.guess-input');
const guessInput = document.querySelector('.guess-input input');
const easyBtn = document.getElementById('easyBtn');
const mediumBtn = document.getElementById('mediumBtn');
const hardBtn = document.getElementById('hardBtn');
const gameRangeText = document.getElementById('gameRangeText');

let messageDiv = document.getElementById('messageDiv');
if (!messageDiv) {
    messageDiv = document.createElement('div');
    messageDiv.id = 'messageDiv';
    messageDiv.style.marginTop = '20px';
    document.body.appendChild(messageDiv);
}

function startGame(selectedMin, selectedMax, label) {
    min = selectedMin;
    max = selectedMax;
    randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    gameRangeText.textContent = `Guess a number ${min}-${max}`;
    guessInputDiv.style.display = 'block';
    guessInput.value = '';
    guessInput.disabled = false;
    playAgainButton.style.display = 'none';
    messageDiv.textContent = '';
    guessInput.focus();
    easyBtn.style.display = 'none';
    mediumBtn.style.display = 'none';
    hardBtn.style.display = 'none';
    guessCount = 0;
    guessHistory = [];
    guessCountSpan.textContent = '0';
    guessHistoryList.innerHTML = '';
}

easyBtn.addEventListener('click', function () {
    startGame(1, 20, 'Easy');
});
mediumBtn.addEventListener('click', function () {
    startGame(1, 100, 'Medium');
});
hardBtn.addEventListener('click', function () {
    startGame(1, 500, 'Hard');
});

function handleGuess() {
    const guess = parseInt(guessInput.value);
    if (isNaN(guess) || guess < min || guess > max) {
        messageDiv.textContent = `Please enter a valid number between ${min} and ${max}.`;
        return;
    }
    guessCount++;
    let resultText = '';
    if (guess < randomNumber) {
        resultText = ' (Too low)';
        messageDiv.textContent = 'Too low! Try again.';
        guessInput.value = '';
    } else if (guess > randomNumber) {
        resultText = ' (Too high)';
        messageDiv.textContent = 'Too high! Try again.';
        guessInput.value = '';
    } else {
        resultText = ' (Correct!)';
        messageDiv.textContent = 'Congratulations! You guessed the right number: ' + randomNumber;
        guessInput.disabled = true;
        playAgainButton.style.display = 'inline-block';
    }
    guessHistory.push({ guess, resultText });
    guessCountSpan.textContent = guessCount;
    const guessItem = document.createElement('li');
    guessItem.textContent = guess + resultText;
    guessHistoryList.appendChild(guessItem);
}

guessInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !guessInput.disabled) {
        handleGuess();
    }
});


guessInput.addEventListener('focus', function () {
    messageDiv.textContent = '';
});

document.addEventListener('click', function () {
    messageDiv.textContent = '';
});

playAgainButton.addEventListener('click', function () {
    easyBtn.style.display = 'inline-block';
    mediumBtn.style.display = 'inline-block';
    hardBtn.style.display = 'inline-block';
    guessInputDiv.style.display = 'none';
    playAgainButton.style.display = 'none';
    gameRangeText.textContent = 'Choose a difficulty to start playing!';
    messageDiv.textContent = '';
    guessInput.value = '';
    guessInput.disabled = false;
    guessCount = 0;
    guessHistory = [];
    guessCountSpan.textContent = '0';
    guessHistoryList.innerHTML = '';
});
