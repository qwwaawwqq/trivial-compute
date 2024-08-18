import { Board } from './board.js';
import { Category } from './category.js';
import { Die } from './die.js';
import { Direction } from './direction.js';
import { Player } from './player.js';
import { Question } from './question.js';
import { Color } from './color.js';
import { SquareType } from './squareType.js';

import { doc, setDoc, onSnapshot, getDoc, collection } from 'firebase/firestore'

import { v4 } from "uuid";

class InvalidPlayerCountError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidPlayerCountError';
    }
}

class InvalidCategoryCountError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidCategoryCountError';
    }
}

/**
 * Class representing a game session.
 */
export class GameSession {

    // Public methods

    /**
     * Factory method to generate a new GameSession instance.
     * @param {Object<Color, string>} categoryNames - The names of the categories.
     * @param {Array<string>} playerNames - The names of the players.
     * @param {Firestore} firestore - A reference to a Firestore database.
     * @returns {Promise<GameSession>} A promise that resolves to a new GameSession instance.
     */
    static create(categoryNames, playerNames, firestore) {
        // Ensure input lengths are valid. Throw specific exception if not.
        this.validateInputs(categoryNames, playerNames);

        const TOKEN_ORDER = [Color.RED, Color.YELLOW, Color.GREEN, Color.BLUE];
        const players = [];
        for (let i = 0; i < playerNames.length; i++) {
            const player = new Player(playerNames[i], TOKEN_ORDER[i]);
            players.push(player);
        }

        // Create promises for each of the 4 Category instances,
        // where each Category is generated from a provided categoryName.
        const categoryPromises = Object.entries(categoryNames).map(([color, categoryName]) =>
            Category.create(categoryName, firestore).then(category => [color, category])
        );

        return Promise.all([
            Board.create(firestore),
            Promise.all(categoryPromises).then(entries => Object.fromEntries(entries))
        ])
        .then(([board, categories]) => {
            return new GameSession(board, categories, players);
        })
        .catch(error => {
            console.error('Error creating game session:', error);
            throw new Error('Error creating game session.');
        });
    }

    /**
     * Simulates rolling the die and determines the available directions for the current player.
     * This is the start of use case 2.
     * This should be called by the API route handling the die rolling button.
     * This method updates the number of moves left for the current player based on the die roll.
     * @returns {Object} An object containing:
     *   @property {number} roll - The result of the die roll, representing the number of moves left for the current player.
     *   @property {Array<Direction>} availableDirections - The list of directions available for the player from their current position.
     */
    rollDie() {
        this.currentPlayer.movesLeft = this.die.roll();
        // You should always have the opportunity to pick a direction at this point.
        // We assume that's the case even if this die roll is done based on a Roll Again space.
        return { 
            roll: this.currentPlayer.movesLeft, 
            availableDirections: this.getAvailableDirections(false) 
        };
    }

    /**
     * This is part of use case 2.
     * This should be called by the API route handling the button indicating player's choice of direction.
     * Since it is not initiated by a die roll, the player should not have the freedom to choose their next direction.
     * Allows the current player to pick a direction to move to the next square position.
     * Then, determine the path the player will take through spaces as long as there's no intersection.
     * Stop when there is an intersection, then return the path the player took and their next options.
     * Updates their position.
     * @param {Direction} direction - The direction in which the player wants to move.
     * @returns {Object} An object containing the path and relevant decision information:
     *      @property {Array<int>} path - An array of positions the player has moved through.
     *      @property {string} currentPlayerName - The name of the current player. Can be used to determine which player's token to move.
     *      @property {string} currentPlayerColor - The color of the current player's token. Can be used to determine which player's token to move.
     *      @property {SquareType|null} squareType - The type of the current square if the player has run out of moves, otherwise null.
     *      @property {Object<Color, string>|null} categoryOptions - An object mapping colors to category names if the square type is CENTER, otherwise null.
     *      @property {Object|null} question - A question object if the square type is NORMAL, otherwise null.
     *      @property {Array<Direction>} availableDirections - An array of available directions if the player is at an intersection, otherwise an empty array.
     */
    pickDirection(direction) {
        let path = [];
        let nextDirection = direction;
        path.push(this.currentPlayer.position);
        this.tempDebug("DEBUG A");
        console.log(nextDirection);
        do {
            this.tempDebug("DEBUG B");
            console.log(nextDirection);
            this.currentPlayer.moveOnce(nextDirection);
            path.push(this.currentPlayer.position);
            this.tempDebug("DEBUG C");
            console.log(nextDirection);
            nextDirection = this.getAvailableDirections(true)[0];
        } while ((!(this.currentPlayer.movesLeft <= 0)) && (!(this.getCurrentSquare().isIntersection)));
        this.tempDebug("DEBUG D");
        // If we are out of moves, there's no decision left to make. 
        // Otherwise, we must be at an intersection, so we need to ask the player to make a decision.
        if (this.currentPlayer.movesLeft <= 0) {
            // Return the decision information needed by the square.
            this.tempDebug("DEBUG E");

            const { squareType, categoryOptions, question } = this.activateSquare();
            return {
                path: path,
                currentPlayerIndex: this.currentPlayerIndex,
                squareType: squareType,
                categoryOptions: categoryOptions,
                question: question,
                availableDirections: []
            };
        } else { 
            this.tempDebug("DEBUG F");
            // Assume this is an intersection.
            // Since we are in the middle of a turn, do not allow the player to turn back.
            return {
                path: path,
                currentPlayerIndex: this.currentPlayerIndex,
                squareType: null,
                categoryOptions: null,
                question: null,
                availableDirections: this.getAvailableDirections(true)
            };
        }
    }

    /**
     * This is part of use cases 3 and 4.
     * This should be called by the API route handling the buttons indicating player's choice of answer when presented with a question.
     * Evaluates if the given answer is correct.
     * @param {string} answer - The player's answer.
     * @return {Object} An object with the correct answer and whether the player's answer is correct.
     */
    evaluateAnswer(answer) {
        const correctAnswer = this.currentQuestion.answer;
        const isCorrect = correctAnswer === answer;
        this.recentlyAnsweredCorrectly = isCorrect;
        return {
            "correctAnswer": correctAnswer,
            "isCorrect": isCorrect
        };
    }

    /**
     * This is part of use cases 3 and 4, towards the end.
     * This should be called by the API route handling the button that should display when the game is displaying the correct answer feedback.
     * Triggers actions that should happen after the player has viewed the correct answer.
     * @return {Object} An object containing the following:
     *      @property {Object | null} endGameData - If the game is over, this will contain data about the game. Otherwise, it will be null. Decide whether to continue the game or not based on this.
     *      @property {string | null} nextPlayerName - the player whose turn is up next. Used to populate the turn display. If the game is over, or if the player didn't score a point, this isn't populated.
     *      @property {int | null} scoreboardToUpdate - Identifies which scoreboard to update. Between 0-3. If the game is over, or if the player didn't score a point, this isn't populated.
     *      @property {Object<Color, boolean> | null} score - New score to put into the scoreboard identified by scoreboardToUpdate.
     */
    acknowledgeAnswer() {
        const isCorrect = this.recentlyAnsweredCorrectly;
        let scoreboardToUpdate = null;
        let score = null;
        if (isCorrect) {
            if (this.getCurrentSquare().isHQ) {
                this.awardPoint();
                scoreboardToUpdate = this.currentPlayerIndex;
                score = this.currentPlayer.score;
            }
            if (this.getCurrentSquare().isCenter && this.checkForWinner()) {
                return {
                    endGameData: this.endGame(), // End use case 4 if player has won
                    nextPlayerName: null,
                    scoreboardToUpdate: null,
                    score: null
                }
            }
            // This player's turn continues.
        } else {
            this.endTurn();
        }
        return {
            endGameData: null, 
            nextPlayerName: this.currentPlayer.name,
            scoreboardToUpdate: scoreboardToUpdate,
            score: score
        }  // End use cases 3 or 4
    }

    /**
     * This is part of use cases 3 and 4.
     * This should be called by the API route handling the buttons indicating player's choice of answer when presented with a question.
     * Evaluates if the given answer is correct.
     * @return {Object} An object with the correct answer and whether the player's answer is correct.
     */
    showAnswer() {
        const correctAnswer = this.currentQuestion.answer;
        return {
            "correctAnswer": correctAnswer
        };
    }

    /**
     * This is part of use cases 3 and 4, towards the end.
     * This should be called by the API route handling the button that should display when the game is displaying the correct answer feedback.
     * Triggers actions that should happen after the player has viewed the correct answer.
     * @param {boolean} isCorrect - Whether or not the player answered correctly.
     * @return {Object} An object containing the following:
     *      @property {Object | null} endGameData - If the game is over, this will contain data about the game. Otherwise, it will be null. Decide whether to continue the game or not based on this.
     *      @property {string | null} nextPlayerName - the player whose turn is up next. Used to populate the turn display. If the game is over, or if the player didn't score a point, this isn't populated.
     *      @property {int | null} scoreboardToUpdate - Identifies which scoreboard to update. Between 0-3. If the game is over, or if the player didn't score a point, this isn't populated.
     *      @property {Object<Color, boolean> | null} score - New score to put into the scoreboard identified by scoreboardToUpdate.
     */
    judgeAnswer(isCorrect) {
        let scoreboardToUpdate = null;
        let score = null;
        if (isCorrect) {
            if (this.getCurrentSquare().isHQ) {
                this.awardPoint();
                scoreboardToUpdate = this.currentPlayerIndex;
                score = this.currentPlayer.score;
            }
            if (this.getCurrentSquare().isCenter && this.checkForWinner()) {
                return {
                    endGameData: this.endGame(), // End use case 4 if player has won
                    nextPlayerName: null,
                    scoreboardToUpdate: null,
                    score: null
                }
            }
            // This player's turn continues.
        } else {
            this.endTurn();
        }
        return {
            endGameData: null, 
            nextPlayerName: this.currentPlayer.name,
            scoreboardToUpdate: scoreboardToUpdate,
            score: score
        }  // End use cases 3 or 4
    }

    /**
     * This is part of use case 4.
     * This should be called by the API route handling the buttons indicating player's choice of category at the center square.
     * Allows a player to select a category based on a color.
     * @param {Color} color - The color representing the category.
     * @return {Question} A question from the selected category.
     */
    selectCategory(color) {
        const category = this.categories[color];
        this.currentQuestion = category.pickRandomQuestion();
        console.log(this.currentQuestion);
        return this.currentQuestion;
    }

    /**
     * Retrieve the names of the categories and players, in the same format that would be provided the create() method.
     * @returns {Object}
     *      @property {Object<Color, string>} categoryNames
     *      @property {Array<string>} playerNames
     */
    get names() {
        const categoryNames = {};
        for (const color in this.categories) {
            categoryNames[color] = this.categories[color].name;
        }

        const playerNames = [];
        for (let i = 0; i < this.players.length; i++) {
            const playerName = this.players[i].name;
            playerNames.push(playerName);
        }

        return {
            categoryNames: categoryNames,
            playerNames: playerNames
        };
    }

    /**
     * Saves this game session as a JSON to Firestore.
     */
    saveJSON() {
        const json = this.toJSON();
        const docRef = doc(firebase_db, 'gameSessions', this.GameSessionID);
        console.log(json);
        setDoc(docRef, json).then(() => {
            console.log('Game session successfully saved!');
        }).catch((error) => {
            console.error('Error saving game session:', error);
        });

    }

    // Private methods

    /**
     * DO NOT DIRECTLY INVOKE EXTERNALLY - please use GameSession.create() instead.
     * Constructor for a new GameSession.
     * @param {Board} board - The game board.
     * @param {Object<Color, Category>} categories - The game categories associated with different color keys.
     * @param {Array<Player>} players - The list of players in the game session.
     * @private
     */
    constructor(board, categories, players) {
        this.die = new Die();
        this.gameboard = board;
        this.categories = categories;
        this.players = players;
        this.currentPlayerIndex = 0;
        this.currentPlayer = this.players[this.currentPlayerIndex];
        this.recentlyAnsweredCorrectly = false;
        this.currentQuestion = null;
        /**
         * Unique identifier for this game session.
         * @type {string}
         */
        this.GameSessionID = v4();
    }

    /**
     * Validate the provided constructor inputs.
     * @param {Array<string>} categoryNames - The game categories associated with different colors.
     * @param {Array<string>} playerNames - The list of players in the game session.
     * @throws {InvalidPlayerCountError} Thrown when the number of players is invalid.
     * @throws {InvalidCategoryCountError} Thrown when the number of categories is invalid.
     * @private
     */
    static validateInputs(categoryNames, playerNames) {
        if ((playerNames.length < 1) || (playerNames.length > 4)) {
            throw new InvalidPlayerCountError("There must be between 1-4 players, inclusive.");
        }

        if (Object.keys(categoryNames).length !== 4) {
            throw new InvalidCategoryCountError("There must be exactly 4 categories.");
        }
    }

    /**
     * Ends the current player's turn and prepares for the next player's turn.
     */
    endTurn() {
        const nextPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.changeTurn(nextPlayerIndex);
    }

    /**
     * Changes the turn to a specified player index.
     * @param {int} newPlayerIndex - The index of the new current player.
     */
    changeTurn(newPlayerIndex) {
        this.currentPlayerIndex = newPlayerIndex;
        this.currentPlayer = this.players[this.currentPlayerIndex];
    }

    /**
     * Retrieves the current square of the player.
     * @return {Square} The current square of the player.
     */
    getCurrentSquare() {
        return this.gameboard.getSquare(this.currentPlayer.position);
    }

    /**
     * Retrieves the directions available to the current player from their current position.
     * @param {boolean} excludePreviousDirection - If set to true, do not include where the player just came from.
     * @return {Array<Direction>} The list of available directions.
     * @private
     */
    getAvailableDirections(excludePreviousDirection) {
        const currentPlayerNeighbors = this.gameboard.getNeighbors(this.currentPlayer.position);
        let availableDirections = Object.keys(currentPlayerNeighbors);
        if (excludePreviousDirection) {
            // Filter out the direction that the player just came from.
            availableDirections = availableDirections.filter(k => k !== this.currentPlayer.previousSquareDirection);
        }
        return availableDirections;
    }

    /**
     * Used when landing on a square. The return value provides the information needed to prompt the user with a corresponding UI depending on the square's type.
     * @returns {Object} An object containing the type of square and any additional information:
     *      @property {SquareType} squareType - The type of the current square.
     *      @property {Object<Color, string>|null} categoryOptions - An object of categories if the square type is CENTER, otherwise null.
     *      @property {Object|null} question - A question object if the square type is NORMAL, otherwise null.
     * @private
     */
    activateSquare() {
        let squareType;
        let categoryOptions = null;
        let question = null;

        if (this.getCurrentSquare().isRollAgain) {
            squareType = SquareType.ROLL_AGAIN;
        } else if (this.getCurrentSquare().isCenter) {
            // This should prompt the player to choose a category.
            squareType = SquareType.CENTER;
            categoryOptions = {}; 
            for (const key in this.categories) {
                categoryOptions[key] = this.categories[key].toJSON();
            }
        } else if (this.getCurrentSquare().isHQ) {
            // This should prompt the player to answer a question.
            squareType = SquareType.HQ;
            question = this.getQuestion().toJSON(); 
        } else {
            // This should prompt the player to answer a question.
            squareType = SquareType.NORMAL;
            question = this.getQuestion().toJSON(); 
        }

        return {
            squareType: squareType,
            categoryOptions: categoryOptions,
            question: question 
        }
    }

    /**
     * Get a question from the category that corresponds to the color of the square that the current player is on.
     * @return {Question} The question for the current player.
     * @private
     */
    getQuestion() {
        const color = this.getCurrentSquare().color;
        const category = this.categories[color];
        this.currentQuestion = category.pickRandomQuestion();
        console.log(this.currentQuestion);
        return this.currentQuestion;
    }

    /**
     * Awards points to the current player based on the question they answered.
     * @private
     */
    awardPoint() {
        const color = this.getCurrentSquare().color;
        this.currentPlayer.awardPoint(color);
    }

    /**
     * Checks if the current player has won the game.
     * @return {boolean} True if the current player has won, otherwise false.
     * @private
     */
    checkForWinner() {
        return this.currentPlayer.isWinner();
    }

    /**
     * Returns the final game state. Should be used at the end of the game.
     * @return {Object} The final game state.
     * @private
     */
    endGame() {
        return {
            "winner": this.currentPlayer.name
        };
    }

    toJSON() {
        const playerJSONs = [];
        for (const player of this.players) {
            playerJSONs.push(player.toJSON());
        }

        const categoryJSONs = {};
        for (const color in this.categories) {
            categoryJSONs[color] = this.categories[color].toJSON();
        }

        let currentQuestion = null;
        if (!(this.currentQuestion === null)) {
            currentQuestion = this.currentQuestion.toJSON();
        }

        return {
            gameboard: this.gameboard.toJSON(),
            categories: categoryJSONs,
            players: playerJSONs,
            currentPlayerIndex: this.currentPlayerIndex,
            recentlyAnsweredCorrectly: this.recentlyAnsweredCorrectly,
            currentQuestion: currentQuestion,
            GameSessionID: this.GameSessionID
        }
    }

    tempDebug(id) {
        console.log(id);
        console.log(this.currentPlayer.name);
        console.log(this.currentPlayer.position);
        console.log(this.currentPlayer.movesLeft);
        console.log(this.currentPlayer.score);
        console.log(this.currentQuestion);
        console.log(this.getCurrentSquare().toJSON());
    }
}
