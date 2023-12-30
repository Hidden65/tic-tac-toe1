document.addEventListener('DOMContentLoaded', () => {
    authenticate();
});

function authenticate() {
    const password = prompt("Enter the secret password:");

    // Replace 'yourSecretPassword' with the actual password you want to use
    if (password === '1234') {
        initializeGame();
    } else {
        const tryAgain = confirm("Incorrect password. Try again?");
        if (tryAgain) {
            authenticate();
        } else {
            alert("Access denied.");
            // Redirect or perform other actions for unauthorized access
        }
    }
}

function initializeGame() {
    const board = document.getElementById('board');
    let cells = Array.from({ length: 9 }, (_, index) => createCell(index));

    function createCell(index) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = index;
        cell.addEventListener('click', () => makeMove(index));
        board.appendChild(cell);
        return cell;
    }

    function makeMove(index) {
        if (!cells[index].textContent) {
            cells[index].textContent = 'X';
            if (checkWinner('X')) {
                congratulateWinner();
            } else if (checkTie()) {
                showTryAgain();
            } else {
                setTimeout(() => {
                    computerMove();
                    if (checkWinner('O')) {
                        showTryAgain();
                    }
                }, 500);
            }
        }
    }

    function computerMove() {
        const bestMove = getBestMove();
        cells[bestMove].textContent = 'O';
    }

    function getBestMove() {
        let bestScore = -Infinity;
        let move;

        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].textContent) {
                cells[i].textContent = 'O';
                const score = minimax(cells, 0, false, 2); // Limiting depth to 2
                cells[i].textContent = '';

                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }

        return move;
    }

    function minimax(board, depth, isMaximizing, maxDepth) {
        if (checkWinner('X')) {
            return -1;
        } else if (checkWinner('O')) {
            return 1;
        } else if (checkTie()) {
            return 0;
        }

        if (depth === maxDepth) {
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i].textContent) {
                    board[i].textContent = 'O';
                    const score = minimax(board, depth + 1, false, maxDepth);
                    board[i].textContent = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i].textContent) {
                    board[i].textContent = 'X';
                    const score = minimax(board, depth + 1, true, maxDepth);
                    board[i].textContent = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkWinner(player) {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return cells[a].textContent === player && cells[b].textContent === player && cells[c].textContent === player;
        });
    }

    function checkTie() {
        return cells.every(cell => cell.textContent === 'X' || cell.textContent === 'O');
    }

    function congratulateWinner() {
        const winner = checkWinner('X');
        if (winner) {
            setTimeout(() => {
                
             window.location.href = 'winner.html'; // Redirect to winner page
            }, 10);
        }
    }
    
    

    function showTryAgain() {
        setTimeout(() => {
            alert("You loses now call me and say 'I LOVE YOU'");
            resetGame();
        }, 10);
    }

    function resetGame() {
        cells.forEach(cell => {
            cell.textContent = '';
        });
    }
}
