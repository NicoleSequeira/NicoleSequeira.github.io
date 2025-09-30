// For Loop function that counts from 1 to 10 with 0.5 second delay between iterations
async function runForLoop() {
    const output = document.querySelector('.for-loop-container .output');
    const button = document.querySelector('.for-loop-container button');

    output.innerHTML = '';
    button.textContent = 'Running...';
    button.disabled = true; // Disable button during loop execution

    for (let i = 1; i <= 10; i++) {
        output.innerHTML += `${i} `;

        // Wait for 0.5 seconds before the next iteration
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Change button to "Restart"
    button.textContent = 'Restart';
    button.disabled = false;
}

// While Loop function that adds random numbers until total exceeds 30
async function runWhileLoop() {
    const output = document.querySelector('.while-loop-container .output');
    const button = document.querySelector('.while-loop-container button');

    output.innerHTML = '';
    button.textContent = 'Running...';
    button.disabled = true; // Disable button during loop execution

    let total = 0;
    let iteration = 1;

    while (total <= 30) {
        // Generate random number between 1 and 10
        const randomNumber = Math.floor(Math.random() * 10) + 1;

        // Add to total
        total += randomNumber;

        // Display the current iteration with the random number and running total
        output.innerHTML += `<div>Step ${iteration}: Added ${randomNumber} → Running total: ${total}</div>`;

        // Increment iteration counter
        iteration++;

        // Wait for 1 second before the next iteration to see the progression
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Change button to "Restart"
    button.textContent = 'Restart';
    button.disabled = false;
}

// forEach Loop function that iterates through background colors
async function runForEachLoop() {
    const output = document.querySelector('.forEach-loop-container .output');
    const button = document.querySelector('.forEach-loop-container button');

    output.innerHTML = '';
    button.textContent = 'Running...';
    button.disabled = true; // Disable button during loop execution

    const colors = [
        { name: 'Light Blue', value: '#ADD8E6' },
        { name: 'Light Green', value: '#90EE90' },
        { name: 'Light Pink', value: '#FFB6C1' },
        { name: 'Light Yellow', value: '#FFFFE0' },
        { name: 'Light Coral', value: '#F08080' },
        { name: 'Light Purple', value: '#DDA0DD' }
    ];

    output.innerHTML = '<div><strong>Cycling through background colors:</strong></div><br>';

    // Use forEach with async delay
    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];

        // Clear previous color display and show current color
        const colorDisplay = `<div style="background-color: ${color.value}; padding: 20px; border-radius: 8px; margin: 10px 0; color: #333; font-weight: bold; border: 2px solid #ccc;">Color ${i + 1}: ${color.name}</div>`;

        // Replace the content to show only the current color
        output.innerHTML = '<div><strong>Cycling through background colors:</strong></div><br>' + colorDisplay;

        // Wait for 1.5 seconds before the next iteration
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // Change button to "Restart"
    button.textContent = 'Restart';
    button.disabled = false;
}