let currentPlayer = 'X';
let cells = document.querySelectorAll('.cell');
let resultStrip = document.getElementById('resultStrip');
let resultText = document.getElementById('resultText');

cells.forEach(cell => cell.innerText = '');

function cellClicked(index) {
    if (cells[index].innerText === '' && !checkWinner(cells) && !checkDraw(cells)) {
        cells[index].innerText = currentPlayer;
        if (checkWinner(cells)) {
            resultText.innerText = checkWinner(cells) + ' wins!';
            resultStrip.style.display = 'flex';
        } else if (checkDraw(cells)) {
            resultText.innerText = 'It\'s a draw!';
            resultStrip.style.display = 'flex';
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                setTimeout(aiMove, 100); // Delay AI move to improve responsiveness
            }
        }
    }
}

function checkWinner(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Check for 'X' win
    if (winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a].innerText === 'X' && board[a].innerText === board[b].innerText && board[a].innerText === board[c].innerText;
    })) {
        return 'X';
    }

    // Check for 'O' win
    if (winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a].innerText === 'O' && board[a].innerText === board[b].innerText && board[a].innerText === board[c].innerText;
    })) {
        return 'O';
    }

    return null;
}

function checkDraw(board) {
    return [...board].every(cell => cell.innerText !== '') && !checkWinner(board);
}

function reset() {
    cells.forEach(cell => cell.innerText = '');
    currentPlayer = 'X';
    resultStrip.style.display = 'none';
}

function minimax(board, depth, isMaximizing) {
    if (checkWinner(board)) {
        return isMaximizing ? -10 : 10;
    } else if (checkDraw(board) || depth === 0) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i].innerText === '') {
                board[i].innerText = 'O';
                let score = minimax([...board], depth - 1, false);
                board[i].innerText = ''; // Undo move
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i].innerText === '') {
                board[i].innerText = 'X';
                let score = minimax([...board], depth - 1, true);
                board[i].innerText = ''; // Undo move
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}

function aiMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].innerText === '') {
            cells[i].innerText = 'O';
            let score = minimax([...cells], 9, false); // Depth can be adjusted
            cells[i].innerText = ''; // Undo move
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    cells[bestMove].innerText = 'O';
    currentPlayer = 'X';
    if (checkWinner(cells)) {
        resultText.innerText = checkWinner(cells) + ' wins!';
        resultStrip.style.display = 'flex';
    } else if (checkDraw(cells)) {
        resultText.innerText = 'It\'s a draw!';
        resultStrip.style.display = 'flex';
    }
}