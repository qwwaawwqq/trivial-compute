//Wont run this for now. Causing errors.
import { Square } from '../src/gamelogic/square.js';
import { GameSession } from '../src/gamelogic/gameSession.js';
import { firebaseConfig } from '../src/firebase/firebaseConfig.js';
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { Color } from '../src/gamelogic/color.js';
import { Question } from '../src/gamelogic/question.js'
let firebaseApp;

beforeAll(() => {
    firebaseApp = initializeApp(firebaseConfig);
});

test('Create gameSession with 4 players and 4 categories by name', async () => {
    firebaseApp = initializeApp(firebaseConfig);
    const playerNames = ["Abel", "Cain", "Abel2", "Cain2"];
    const categoryNames = {
        [Color.RED]: "Art & Literature", 
        [Color.GREEN]: "Geography", 
        [Color.YELLOW]: "History", 
        [Color.BLUE]: "Sports & Leisure"};

    const firebase_db = getFirestore();
    
    // GameSession.create(categoryNames, playerNames, firebase_db).then(game => {

    //     // TODO put test code in here
    //     // This block is what should run after the Promise made by the `create` method completes.
    //     // That Promise resolves to the GameSession instance named `game`.
    //     console.log(game.toJSON());

    // });
    const game = await GameSession.create(categoryNames, playerNames, firebase_db);
    // Add tests here.

    //Test getNeighbors function of center square
    function testgetNeighbors() {
        const result = game.gameboard.getNeighbors(44);
        expect(Object.keys(result).length).toBe(4); // Expected to return 4 squares from center.
    }
    testgetNeighbors();

    
    // Test squares and their functions from gameboard.
    function testSquares(){
        
            Object.keys(game.gameboard.squares).forEach( key => {
            let currentSquare = game.gameboard.getSquare(key)
            expect(currentSquare).toBeInstanceOf(Square); // Its a square.
            expect(currentSquare.position).toBe(key); // Retrieved square has matching position with key from gameBoard.

            // Below tests just check if the get function has a defined return value.
            expect(currentSquare.color).toBeDefined();
            expect(currentSquare.squareType).toBeDefined();
            expect(currentSquare.isHQ).toBeDefined();
            expect(currentSquare.isCenter).toBeDefined();
            expect(currentSquare.isRollAgain).toBeDefined();
            expect(currentSquare.isIntersection).toBeDefined();

            // To Json matches variables.
            let result = currentSquare.toJSON();
            expect(result.color).toBe(currentSquare.color);
            expect(result.squareType).toBe(currentSquare.squareType);

        })
    }

    testSquares();


    // Simulate playing the game.
    function simulateGame() {

        const r = game.rollDie()
        let currentQuestion;
        let directionChoices = r.availableDirections;
        while(directionChoices.length != 0) {
            let tempResult = game.pickDirection(directionChoices[0]);  // Move until no more directions are available.
            directionChoices = tempResult.availableDirections;
            currentQuestion = tempResult.question;

        }
        expect(currentQuestion).toBeInstanceOf(Question); // Expect question to return after choosing directions

        const currentAnswer = game.showAnswer();
        expect(currentAnswer).toBeDefined(); //Expect question to have a defined answer.
        let turnInformation = game.judgeAnswer(true); // Judge answer to be true. 
        expect(turnInformation.nextPlayerName).toBe(playerNames[0]); //Expect to still be first player name because TRUE.

        let nextTurnInformation = game.judgeAnswer(false); // Judge answer to be false. 
        expect(nextTurnInformation.nextPlayerName).toBe(playerNames[1]); // Next player's turn expected

        //End Game
        let endResult = game.endGame();
        expect(endResult.winner).toBe(playerNames[1]) //End game should return current player.

        expect(game.toJSON).toBeDefined(); //Check if toJSON function works.

        expect(game.names).toHaveProperty('categoryNames');
        expect(game.names).toHaveProperty('playerNames');

    }
    simulateGame();
    
    

    // TESTING rollDie within gameSession
    function testRoll() {
    const rolls = [];
    for (let i = 0; i < 100; i++) {
        const rollTest = game.rollDie();
        const roll = rollTest.roll;
        // Ensure the roll is within the range 1 to 6
        expect(roll).toBeGreaterThanOrEqual(1);
        expect(roll).toBeLessThanOrEqual(6);
        rolls.push(roll);
    }

    // Ensure all possible outcomes (1 to 6) are present
    for (let i = 1; i <= 6; i++) {
        expect(rolls).toContain(i);
    }
    }
    testRoll();


})
