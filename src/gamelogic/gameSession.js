import { Board } from './board.js';
import { Category } from './category.js';
import { Die } from './die.js';
import { Direction } from './direction.js';
import { Player } from './player.js';
import { Question } from './question.js';
import { Color } from './color.js';
import { SquareType } from './squareType.js';

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
     * This is the start of use case 1.
     * This should be called by the API route handling the press of the button that starts the game from the config screen.
     * @param {Object<string, string>} categoryNames - The names of the categories.
     * @param {Array<string>} playerNames - The names of the players.
     * @returns {Promise<GameSession>} A promise that resolves to a new GameSession instance.
     */
    static create(categoryNames, playerNames) {
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
            Category.create(categoryName).then(category => [color, category])
        );

        return Promise.all([
            Board.create(),
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
        this.currentPlayerMovesLeft = this.die.roll();
        // You should always have the opportunity to pick a direction at this point.
        // We assume that's the case even if this die roll is done based on a Roll Again space.
        return { 
            roll: this.currentPlayerMovesLeft, 
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
     * @param {string} direction - The direction in which the player wants to move.
     * @returns {Object} An object containing the path and relevant decision information:
    *      @property {Array<int>} path - An array of positions the player has moved through.
    *      @property {SquareType|null} squareType - The type of the current square if the player has run out of moves, otherwise null.
    *      @property {Array|null} categoryOptions - An array of categories if the square type is CENTER, otherwise null.
    *      @property {Object|null} question - A question object if the square type is NORMAL, otherwise null.
    *      @property {Array<Direction>} availableDirections - An array of available directions if the player is at an intersection, otherwise an empty array.
    */
    pickDirection(direction) {
        let path = [];
        path.push(this.currentPlayer.position);
        do {
            this.currentPlayer.moveOnce(direction);
            path.push(this.currentPlayer.position);
        } while ((this.currentPlayer.movesLeft <= 0) && !(this.getCurrentSquare().isIntersection));

        // If we are out of moves, there's no decision left to make. 
        // Otherwise, we must be at an intersection, so we need to ask the player to make a decision.
        if (this.currentPlayer.movesLeft <= 0) {
            // Return the decision information needed by the square.

            const { squareType, categoryOptions, question } = this.activateSquare();
            return {
                path: path,
                squareType: squareType,
                categoryOptions: categoryOptions,
                question: question,
                availableDirections: []
            };
        } else { 
            // Assume this is an intersection.
            // Since we are in the middle of a turn, do not allow the player to turn back.
            return {
                path: path,
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
        const correctAnswer = this.currentQuestion.getAnswer();
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
     * @return {Object | null} An object if the game was won, otherwise null.
     */
    acknowledgeAnswer() {
        const isCorrect = this.recentlyAnsweredCorrectly;
        if (isCorrect) {
            if (this.getSquare().isHQ) {
                this.awardPoint();
            }
            if (this.getSquare().isCenter && this.checkForWinner()) {
                return this.endGame(); // End use case 4 if player has won
            }
            // This player's turn continues.
        } else {
            this.endTurn();
        }
        return null; // End use cases 3 or 4
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
        return category.pickRandomQuestion();
    }

    // Private methods

    /**
     * DO NOT DIRECTLY INVOKE EXTERNALLY - please use GameSession.create() instead.
     * Constructor for a new GameSession.
     * @param {Board} board - The game board.
     * @param {Object<string, Category>} categories - The game categories associated with different color keys.
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
        const availableDirections = Object.keys(currentPlayerNeighbors);
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
     *      @property {Array|null} categoryOptions - An array of categories if the square type is CENTER, otherwise null.
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
            squareType = SquareType.CENTER;
            categoryOptions = this.categories; // This should prompt the player to choose a category.
        } else {
            squareType = SquareType.NORMAL;
            question = this.getQuestion(); // This should prompt the player to answer a question.
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
        const color = this.getCurrentSquare().getColor();
        const category = this.selectCategory(color);
        this.currentQuestion = category.pickRandomQuestion();
        return this.currentQuestion;
    }

    /**
     * Awards points to the current player based on the question they answered.
     * @private
     */
    awardPoint() {
        const color = this.getSquare().getColor();
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
            "players": this.players,
            "winner": this.currentPlayer
        };
    }
}
