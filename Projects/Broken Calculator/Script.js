// Get DOM elements
const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
let currentInput = "";

// Create a prompt element for divide by zero
const promptDiv = document.createElement('div');
promptDiv.id = 'divZeroPrompt';
promptDiv.style.position = 'fixed';
promptDiv.style.top = '20%';
promptDiv.style.left = '50%';
promptDiv.style.transform = 'translate(-50%, -50%)';
promptDiv.style.background = '#ffdddd';
promptDiv.style.color = '#a00';
promptDiv.style.padding = '20px 40px';
promptDiv.style.borderRadius = '8px';
promptDiv.style.fontSize = '1.2rem';
promptDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
promptDiv.style.display = 'none';
promptDiv.innerText = 'nuh uh: Try again';
document.body.appendChild(promptDiv);

// Hide prompt on Enter key
window.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && promptDiv.style.display === 'block') {
        promptDiv.style.display = 'none';
    }
    // Backspace feature for calculator
    if (e.key === 'Backspace' && promptDiv.style.display !== 'block') {
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            display.value = currentInput;
        }
        // Prevent browser default back navigation
        e.preventDefault();
    }
});

const clearButton = document.getElementById('clear');
clearButton.addEventListener('click', () => {
    currentInput = "";
    display.value = "";
});

const sqrtButton = document.getElementById('sqrt');
sqrtButton.addEventListener('click', () => {
    if (currentInput !== "") {
        try {
            const result = Math.sqrt(eval(currentInput));
            currentInput = result;
            display.value = result;
        } catch (error) {
            display.value = "Error";
        }
    }
});

buttons.forEach(button => {
    // Skip buttons that have their own specific handlers
    if (button.id === 'clear' || button.id === 'sqrt') {
        return;
    }

    button.addEventListener('click', () => {
        const value = button.textContent;
        if (value === '=') {
            try {
                if (/\/0(?!\d)/.test(currentInput.replace(/\s+/g, ''))) {
                    promptDiv.style.display = 'block';
                    display.value = '';
                    currentInput = '';
                    return;
                }
                currentInput = eval(currentInput);
                display.value = currentInput;
            } catch (error) {
                display.value = "nuh uh";
            }
        } else {
            currentInput += value;
            display.value = currentInput; //fixed bug
        }
    });
});
