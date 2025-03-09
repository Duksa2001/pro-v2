let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let difficulty = 'hard'; // Podrazumevani nivo težine

function setDifficulty(level) {
    difficulty = level;
    reset(); // Resetuj igru kada se promeni nivo težine
}

function play(cell, index) {
    if (gameBoard[index] === '' && gameActive && currentPlayer === 'X') {
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        checkWinner();
        if (gameActive) {
            currentPlayer = 'O';
            document.getElementById('status').textContent = `Na potezu je: O (AI)`;
            setTimeout(aiMove, 500); // Mala pauza za prirodniji potez AI-ja
        }
    }
}

function aiMove() {
    if (!gameActive) return;

    let move;
    if (difficulty === 'easy') {
        move = easyMove();
    } else if (difficulty === 'medium') {
        move = mediumMove();
    } else {
        move = minimax(gameBoard, 'O').index;
    }

    gameBoard[move] = 'O';
    document.querySelectorAll('.cell')[move].textContent = 'O';
    checkWinner();
    if (gameActive) {
        currentPlayer = 'X';
        document.getElementById('status').textContent = `Na potezu je: X (ti)`;
    }
}

function easyMove() {
    const availableSpots = gameBoard.reduce((acc, val, idx) => {
        if (val === '') acc.push(idx);
        return acc;
    }, []);
    return availableSpots[Math.floor(Math.random() * availableSpots.length)];
}

function mediumMove() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // Proveri da li AI može da pobedi
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] === 'O' && gameBoard[b] === 'O' && gameBoard[c] === '') return c;
        if (gameBoard[a] === 'O' && gameBoard[c] === 'O' && gameBoard[b] === '') return b;
        if (gameBoard[b] === 'O' && gameBoard[c] === 'O' && gameBoard[a] === '') return a;
    }

    // Proveri da li treba blokirati pobedu igrača
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] === 'X' && gameBoard[b] === 'X' && gameBoard[c] === '') return c;
        if (gameBoard[a] === 'X' && gameBoard[c] === 'X' && gameBoard[b] === '') return b;
        if (gameBoard[b] === 'X' && gameBoard[c] === 'X' && gameBoard[a] === '') return a;
    }

    // Ako nema pobede ili bloka, igraj nasumično
    return easyMove();
}

function checkWinner() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            document.getElementById('status').textContent = `Pobednik je: ${gameBoard[a]}!`;
            document.getElementById('status').classList.add('winner');
            gameActive = false;
            highlightWinningCells(condition);
            return;
        }
    }

    if (!gameBoard.includes('')) {
        document.getElementById('status').textContent = 'Nerešeno!';
        document.getElementById('status').classList.add('draw');
        gameActive = false;
    }
}

function highlightWinningCells(condition) {
    const cells = document.querySelectorAll('.cell');
    condition.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}

function reset() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    document.getElementById('status').textContent = 'Na potezu je: X (ti)';
    document.getElementById('status').classList.remove('winner', 'draw');
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
}

// Minimax algoritam za teški nivo
function minimax(board, player) {
    const availableSpots = board.reduce((acc, val, idx) => {
        if (val === '') acc.push(idx);
        return acc;
    }, []);

    if (checkWin(board, 'X')) return { score: -10 };
    if (checkWin(board, 'O')) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    let moves = [];

    for (let spot of availableSpots) {
        let move = {};
        move.index = spot;
        board[spot] = player;

        if (player === 'O') {
            move.score = minimax(board, 'X').score;
        } else {
            move.score = minimax(board, 'O').score;
        }

        board[spot] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

function checkWin(board, player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] === player && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}