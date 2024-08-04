document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board');
    const diceElement = document.getElementById('dice');
    const rollButton = document.getElementById('roll-dice');
    const currentPlayerElement = document.getElementById('current-player');
    const returnButton = document.getElementById('return-button');
    const chooseDirectionButton = document.getElementById('choose-direction-button');
    const displayQuestionButton = document.getElementById('display-question-button');
    const chooseCategoryButton = document.getElementById('choose-category-button');

    const players = ['Larry', 'Curly', 'Moe', 'Shemp'];
    let currentPlayerIndex = 1; // Starting with Curly

    function createBoard() {
        const boardLayout = [
            'RA', 'Y', 'B', 'G', 'HQ', 'Y', 'B', 'G', 'RA',
            'R', 'W', 'W', 'W', 'Y', 'W', 'W', 'W', 'R',
            'G', 'W', 'PL', 'W', 'B', 'W', 'PC', 'W', 'Y',
            'B', 'W', 'W', 'W', 'G', 'W', 'W', 'W', 'B',
            'HQ', 'B', 'G', 'R', 'TC', 'B', 'G', 'Y', 'HQ',
            'Y', 'W', 'W', 'W', 'R', 'W', 'W', 'W', 'G',
            'R', 'W', 'PM', 'W', 'Y', 'W', 'PR', 'W', 'R',
            'G', 'W', 'W', 'W', 'G', 'W', 'W', 'W', 'B',
            'RA', 'R', 'B', 'G', 'HQ', 'Y', 'R', 'B', 'RA'
        ];

        boardLayout.forEach((type, index) => {
            const square = document.createElement('div');
            square.classList.add('square', getColorClass(type));
            if (type === 'HQ') square.textContent = 'HQ';
            if (type === 'RA') square.textContent = 'RA';
            if (type === 'TC') square.textContent = 'TC';
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
        const colorMap = { 'Y': 'yellow', 'B': 'blue', 'R': 'red', 'G': 'green', 'HQ': 'red', 'RA': 'grey', 'TC': 'grey', 'W': 'white' };
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

    returnButton.addEventListener('click', () => {
        alert("Returning to the previous page.");
        // Add functionality to return to the previous page
    });


    chooseDirectionButton.addEventListener('click', () => {
        const direction = prompt("Choose direction (e.g., North, South, East, West):");
        alert(`You chose: ${direction}`);
        // Add functionality to handle direction choice
    });

    displayQuestionButton.addEventListener('click', () => {
        const question = "Sample question?";
        alert(question);
        window.location.href = 'questionPop.html'
        // Add functionality to display a question
    });

    chooseCategoryButton.addEventListener('click', () => {
        window.location.href = 'centerSquare.html'
        // Add functionality to handle category choice
    });

    createBoard();
});
