document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const diceElement = document.getElementById('dice');
    const rollButton = document.getElementById('roll-dice');
    const currentPlayerElement = document.getElementById('current-player');
    
    const players = ['Larry', 'Curly', 'Moe', 'Shemp'];
    let currentPlayerIndex = 1; // Starting with Curly

    function createBoard() {
        const boardLayout = [
            'RA', 'Y', 'B', 'G', 'HQ', 'Y', 'B', 'G', 'RA',
            'R', 'W', 'PL', 'W', 'Y', 'W', 'PC', 'W', 'R',
            'G', 'W', 'W', 'W', 'B', 'W', 'W', 'W', 'Y',
            'B', 'W', 'W', 'W', 'G', 'W', 'W', 'W', 'B',
            'HQ', 'B', 'G', 'R', 'TC', 'B', 'G', 'Y', 'HQ',
            'Y', 'W', 'PM', 'W', 'R', 'W', 'PR', 'W', 'G',
            'R', 'W', 'W', 'W', 'Y', 'W', 'W', 'W', 'R',
            'G', 'W', 'W', 'W', 'G', 'W', 'W', 'W', 'B',
            'RA', 'R', 'B', 'G', 'HQ', 'Y', 'R', 'B', 'RA'
        ];

        boardLayout.forEach((type, index) => {
            const square = document.createElement('div');
            square.classList.add('square', getColorClass(type));
            if (type === 'HQ') square.textContent = 'HQ';
            if (type === 'RA') square.textContent = 'Roll Again';
            if (type === 'TC') square.textContent = 'Trivial Compute';
            if (type.startsWith('P')) {
                createPlayerSquare(square, type);
            }
            gameBoard.appendChild(square);
        });

        addPlayerPieces();
    }
    

    function createPlayerSquare(square, type) {
        const playerName = ['Larry', 'Curly', 'Moe', 'Shemp'][['PL', 'PC', 'PM', 'PR'].indexOf(type)];
        square.textContent = playerName;
    }

    function getColorClass(type) {
        const colorMap = { 'Y': 'yellow', 'B': 'blue', 'R': 'red', 'G': 'green', 'HQ': 'red', 'RA': 'white', 'TC': 'white', 'W': 'white' };
        return colorMap[type] || 'white';
    }

    function addPlayerPieces() {
        const playerColors = ['red', 'yellow', 'green', 'blue'];
        const playerPositions = [0, 2, 6, 8]; // Corner positions
        players.forEach((player, index) => {
            const piece = document.createElement('div');
            piece.classList.add('player-piece');
            piece.style.backgroundColor = playerColors[index];
            gameBoard.children[playerPositions[index]].appendChild(piece);
        });
    }

    function rollDice() {
        const roll = Math.floor(Math.random() * 6) + 1;
        diceElement.innerHTML = '';
        for (let i = 0; i < roll; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            diceElement.appendChild(dot);
        }
        return roll;
    }

    rollButton.addEventListener('click', () => {
        const roll = rollDice();
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        currentPlayerElement.textContent = `The current player is ${players[currentPlayerIndex]}!`;
    });

    createBoard();
});