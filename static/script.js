let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

function play(cell, index) {
    if (gameBoard[index] === '' && gameActive) {
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        checkWinner();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById('status').textContent = `Na potezu je: ${currentPlayer}`;
    }
}

function checkWinner() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Redovi
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Kolone
        [0, 4, 8], [2, 4, 6]             // Dijagonale
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            document.getElementById('status').textContent = `${gameBoard[a]} je pobedio!`;
            gameActive = false;
            return;
        }
    }

    if (!gameBoard.includes('')) {
        document.getElementById('status').textContent = 'Nerešeno!';
        gameActive = false;
    }
}

function reset() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    document.getElementById('status').textContent = 'Na potezu je: X';
    document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
}