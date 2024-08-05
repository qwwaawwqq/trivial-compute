document.addEventListener('DOMContentLoaded', () => {
    const diceElement = document.getElementById('dice');
    const rollButton = document.getElementById('roll-dice');
    const currentPlayerElement = document.getElementById('current-player');
    const returnButton = document.getElementById('return-button');
    // const chooseDirectionButton = document.getElementById('choose-direction-button');
    const displayQuestionButton = document.getElementById('display-question-button');
    const chooseCategoryButton = document.getElementById('choose-category-button');

    const players = ['Larry', 'Curly', 'Moe', 'Shemp'];
    let currentPlayerIndex = 1; // Starting with Curly



    function createBoardGui() {

        const currentBoard = JSON.parse(localStorage.getItem('gameBoard'));
        console.log(currentBoard);

        const gameBoard = $('.game-board'); //Grabs HTML element to append the squares.

        Object.keys(currentBoard).forEach(key => {
            let currentSquare = currentBoard[key];
            const square = document.createElement('div');
            square.classList.add(currentSquare['color'], currentSquare['squareType']);
            if (square.classList.contains('HQ')){
                square.textContent = ('HQ');
            }
            else if(square.classList.contains('ROLL_AGAIN')){
                square.textContent = ('Roll Again');
            }
            else if(square.classList.contains('CENTER')){
                square.textContent = ('Trivial Compute');
            }

            gameBoard.append(square);
        })

        // addPlayerPieces();
    }

    function createPlayerSquare(square, type) {
        const playerName = ['Larry', 'Curly', 'Moe', 'Shemp'][['PL', 'PC', 'PM', 'PR'].indexOf(type)];
        square.textContent = playerName;
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

    // function rollDice() {
    //     const roll = Math.floor(Math.random() * 6) + 1;
    //     requestAnimationFrame((timestamp)=>animateRoll(timestamp, roll));
    //     return roll;
    // }

    rollButton.addEventListener('click', () => {
        $('#end-turn').toggle();
        $('#roll-dice').toggle();
        let gameID = localStorage.getItem('gameSessionID');
        console.log(gameID);
        $.ajax({
            url: '/api/game/rollDie',
            method: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ gameSessionID : gameID}),
            success: function (response) {
                requestAnimationFrame((timestamp)=>animateRoll(timestamp, response.roll));
            },
            error: function (xhr, status, error) {
                alert("Error Roll Die: " + error);
            }
        });
        
    });
 

    $('#end-turn').click(function() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        currentPlayerElement.textContent = `The current player is ${players[currentPlayerIndex]}!`;
        $('#end-turn').toggle();
        $('#roll-dice').toggle();
        clearDie();
    });

    returnButton.addEventListener('click', () => {
        alert("Returning to the previous page.");
        // Add functionality to return to the previous page
    });


    // chooseDirectionButton.addEventListener('click', () => {
    //     const direction = prompt("Choose direction (e.g., North, South, East, West):");
    //     alert(`You chose: ${direction}`);
    //     // Add functionality to handle direction choice
    // });

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

    createBoardGui();


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


let xFrames = [37, 37, 451, 451, 37, 37, 451, 451];
let yFrames = [15, 221, 15, 221, 15, 221, 15, 221];
let xFrame = [32, 509, 996, 32, 509, 996];
let yFrame = [29, 29, 29, 579, 579, 579];

function clearDie(){
    context.clearRect(0, 0, 60, 60);
    context.drawImage(diceRolling, xFrames[frameIndex], yFrames[frameIndex], 180, 180, 2, 2, 60, 60 );
}
diceRolling.onload = function() {
    context.drawImage(diceRolling, xFrames[frameIndex], yFrames[frameIndex], 180, 180, 2, 2, 60, 60 );
};

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
        context.drawImage(diceImage, xFrame[roll-1], yFrame[roll-1], 430, 422, 0, 0, 60, 60 );
       
    }
}