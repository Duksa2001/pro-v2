let targetCombination = [];
let currentAttempt = 0;
let gameActive = true;
const symbols = ['♠', '♣', '♥', '♦', '★', 'F'];

function startGame() {
    targetCombination = [];
    for (let i = 0; i < 4; i++) {
        targetCombination.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    console.log('Target combination (for debugging):', targetCombination); // Ukloni ovo u produkciji
    currentAttempt = 0;
    gameActive = true;
    document.getElementById('status').textContent = 'Unesi kombinaciju i proveri!';
    document.getElementById('status').classList.remove('winner');
    resetAttempts();
}

function resetAttempts() {
    for (let i = 0; i < 7; i++) {
        const attempt = document.getElementById(`attempt-${i}`);
        attempt.innerHTML = '';
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.onclick = () => selectCell(cell, i);
            attempt.appendChild(cell);
        }
        const result = document.createElement('div');
        result.classList.add('result');
        attempt.appendChild(result);
    }
}

function selectSymbol(symbol) {
    if (!gameActive || currentAttempt >= 7) return;
    const attempt = document.getElementById(`attempt-${currentAttempt}`);
    const cells = attempt.querySelectorAll('.cell');
    for (let cell of cells) {
        if (!cell.textContent) {
            cell.textContent = symbol;
            break;
        }
    }
}

function selectCell(cell, attemptIndex) {
    if (attemptIndex !== currentAttempt || !gameActive) return;
    cell.textContent = ''; // Omogućava brisanje simbola ako se klikne na već popunjenu ćeliju
}

function checkAttempt() {
    if (!gameActive || currentAttempt >= 7) return;

    const attempt = document.getElementById(`attempt-${currentAttempt}`);
    const cells = attempt.querySelectorAll('.cell');
    let guess = [];
    cells.forEach(cell => guess.push(cell.textContent));

    if (guess.includes('')) {
        document.getElementById('status').textContent = 'Popuni sva polja pre provere!';
        return;
    }

    const result = checkGuess(guess, targetCombination);
    displayResult(result, attempt);

    if (result.correctPosition === 4) {
        document.getElementById('status').textContent = 'Pobedio si!';
        document.getElementById('status').classList.add('winner');
        gameActive = false;
    } else if (currentAttempt === 6) {
        document.getElementById('status').textContent = `Igra je gotova! Tražena kombinacija: ${targetCombination.join(' ')}`;
        gameActive = false;
    } else {
        currentAttempt++;
        document.getElementById('status').textContent = 'Unesi sledeću kombinaciju!';
    }
}

function checkGuess(guess, target) {
    let correctPosition = 0;
    let correctSymbol = 0;
    let targetCopy = [...target];
    let guessCopy = [...guess];

    // Prvo proveri tačne pozicije
    for (let i = 0; i < 4; i++) {
        if (guess[i] === target[i]) {
            correctPosition++;
            targetCopy[i] = guessCopy[i] = null;
        }
    }

    // Zatim proveri tačne simbole na pogrešnim pozicijama
    for (let i = 0; i < 4; i++) {
        if (guessCopy[i] && targetCopy.includes(guessCopy[i])) {
            correctSymbol++;
            targetCopy[targetCopy.indexOf(guessCopy[i])] = null;
        }
    }

    return { correctPosition, correctSymbol };
}

function displayResult(result, attempt) {
    const resultDiv = attempt.querySelector('.result');
    for (let i = 0; i < result.correctPosition; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot', 'red');
        resultDiv.appendChild(dot);
    }
    for (let i = 0; i < result.correctSymbol; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot', 'yellow');
        resultDiv.appendChild(dot);
    }
}

function resetGame() {
    startGame();
}

// Pokreni igru na učitavanju stranice
startGame();