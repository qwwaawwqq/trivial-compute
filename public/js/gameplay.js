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
        requestAnimationFrame((timestamp)=>animateRoll(timestamp, roll));
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

const animationDelay = 150;
let elapsedDrawTime = 0;
let lastDrawTime = 0;
let frameIndex = 0;


// Dice animation 
let diceImage = new Image();
let diceRolling = new Image();
diceImage.src = "./assets/dice.png"; //Dice image relative to html.
diceRolling.src = "./assets/diceAnimation.png";
board = document.getElementById('dice');
board.height = 60;
board.width = 60;
let context = board.getContext("2d");
context.fillStyle ='black';
context.clearRect(0, 0, 60, 60);
// context.fillRect(0, 0, 60, 60);

let xFrames = [37, 37, 451, 451, 37, 37, 451, 451];
let yFrames = [15, 221, 15, 221, 15, 221, 15, 221];
let xFrame = [32, 509, 996, 32, 509, 996];
let yFrame = [29, 29, 29, 579, 579, 579];

function animateRoll(timestamp, roll) {
    if (!lastDrawTime) {
        lastDrawTime = timestamp;
    }
    elapsedDrawTime = timestamp - lastDrawTime;
    if (elapsedDrawTime > animationDelay) {
        lastDrawTime = timestamp;
        context.clearRect(0, 0, 60, 60);
        context.drawImage(diceRolling, xFrames[frameIndex], yFrames[frameIndex], 180, 180, 2, 2, 60, 60 );
        frameIndex += 1;
    }

    if (frameIndex < 8) {
        requestAnimationFrame((timestamp)=>animateRoll(timestamp, roll));
    }
    else {
        frameIndex = 0;
        context.clearRect(0, 0, 60, 60);
        context.drawImage(diceImage, xFrame[roll], yFrame[roll], 425, 416, 0, 0, 60, 60 );
       
    }
}