document.addEventListener('DOMContentLoaded', () => {
    const diceElement = document.getElementById('dice');
    const rollButton = document.getElementById('roll-dice');
    const currentPlayerElement = document.getElementById('current-player');
    const returnButton = document.getElementById('return-button');
    // const chooseDirectionButton = document.getElementById('choose-direction-button');
    const displayQuestionButton = document.getElementById('display-question-button');
    const chooseCategoryButton = document.getElementById('choose-category-button');

    let players = [];
    let currentPlayerIndex = 1; //starting with player 1.


    function getNamesGui() {
        let gameID = localStorage.getItem('gameSessionID');
        $.ajax({
            url: '/api/game/names',
            method: 'GET',
            dataType: 'json',
            data: { gameSessionID : gameID},
            success: function (response) {
                let gameCategories = {};
                players = response.playerNames;
                gameCategories = response.categoryNames;
                console.log(gameCategories);
                let i = 1;
                Object.keys(gameCategories).forEach((key)=> {
                    let cName = `.cat${i}`;
                    console.log(gameCategories[key]);
                    console.log(key);
                    $(cName).text(gameCategories[key]);
                    $(cName).addClass(key);
            
                    //make player tokens at the same time.
                    const token = document.createElement('div');
                    token.id = `player${i}_token`;
                    token.classList.add('player-piece');
                    token.textContent =`${i}`;
                    $('#44').append(token);
                    i +=1;

                })

                $('#current-player').text(`It's currently ${players[0]}'s turn!`);
                let playerBlocks = [12, 16, 52, 56];
                for (let j=0; j<4; j++){
                    $(`#${playerBlocks[j]}`).text(players[j]);
                }              
            },
            error: function (xhr, status, error) {
                alert("Error Get Name: " + error);
            }
        });
    }

    

    function createBoardGui() {

        const currentBoard = JSON.parse(localStorage.getItem('gameBoard'));
        console.log(currentBoard);

        const gameBoard = $('.game-board'); //Grabs HTML element to append the squares.

        Object.keys(currentBoard).forEach(key => {
            let currentSquare = currentBoard[key];
            const square = document.createElement('div');
            square.id = String(key);
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
            
            if (key == 22) {
                square.classList.add("player1_score");
            }
            else if (key == 26) {
                square.classList.add("player2_score");
            }
            else if (key == 62) {
                square.classList.add("player3_score");
            }
            else if (key == 66) {
                square.classList.add("player4_score");
            }
            console.log(square.outerHTML);

            gameBoard.append(square);
        })

        // addPlayerPieces();
    }


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
        $('#end-turn').toggle();
        $('#roll-dice').toggle();
        clearDie();
    });

    returnButton.addEventListener('click', () => {
        let consent = confirm("Return to Home?");
        if (consent) {
            window.location.href = 'gameConfig.html'
        }
        else {
            console.log("Somebody tried to quit");
        }
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
    getNamesGui();



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