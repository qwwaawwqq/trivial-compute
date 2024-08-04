import { Board } from './board.js'
import { Category } from './category.js'
import { Die } from './die.js'
import { Direction } from './direction.js'
import { Player } from './player.js'
import { Question } from './question.js'
import { Color } from './color.js'

import { v4 } from "uuid"

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

    /**
     * Factory method to generate a new GameSession instance.
     * This is the correct way to 
     * This is the start of use case 1.
     * This should be called by the API route handling the press of the button that starts the game from the config screen.
     * @param {Array<string>} categoryNames 
     * @param {Array<string>} playerNames 
     * @returns 
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
     * Create a new game session.
     * @param {Object<string, string>} categoryNames - The game categories associated with different color keys.
     * @param {Array<string>} playerNames - The list of players in the game session.
     * @throws {InvalidPlayerCountError} - Thrown when the number of players is invalid
     * @throws {InvalidCategoryCountError} - Thrown when the number of categories is invalid
     */
    constructor(board, categories, players) {

        this.die = new Die();

        this.gameboard = board;
        this.categories = categories;
        this.players = players;

        this.currentPlayerIndex = 0;
        this.currentPlayer = this.players[this.currentPlayerIndex];

        // Temporary storage of state before and after player acknowledges the correct answer.
        this.recentlyAnsweredCorrectly = false;

        // this.categories = {};
        // for (const colorName in categoryNames) {
        //     const category = new Category(categoryNames[colorName]);
        //     this.categories[colorName] = category;
        // }

        this.currentQuestion = null;
        this.GameSessionID = v4();
    }

    /**
     * Validate the provided constructor inputs.
     * @param {Object<string, string>} categoryNames - The game categories associated with different colors.
     * @param {Array<string>} playerNames - The list of players in the game session.
     * @throws {InvalidPlayerCountError} - Thrown when the number of players is invalid
     * @throws {InvalidCategoryCountError} - Thrown when the number of categories is invalid
     */
    static validateInputs(categoryNames, playerNames) {

        if ((playerNames.length < 1) || (playerNames.length > 4)) {
            throw new InvalidPlayerCountError("There must be between 1-4 players, inclusive.");
        }

        if (Object.keys(categoryNames).length != 4) {
            throw new InvalidCategoryCountError("There must be exactly 4 categories.");
        }

    }

    /**
     * Retrieve the game board for this session.
     * @return {Board} The game board.
     */
    getBoard() {
        return this.gameboard;
    }

    /**
     * Initiates the start of a player's turn.
     * @return {int} 
     */
    startTurn() {
        // TODO: What should this do?
        return 0
    }

    /**
     * Ends the current player's turn and prepares for the next player's turn.
     */
    endTurn() {
        // TODO: What should this do?
        const nextPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.changeTurn(nextPlayerIndex)
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
     * Simulates rolling the die.
     * This is the start of use case 2.
     * This should be called by the API route handling the die rolling button.
     * @return {int} The result of the die roll.
     */
    rollDie() {
        this.currentPlayerMovesLeft = this.die.roll();
        return this.useMovesUntilBranch();
    }

    getCurrentSquare() {
        return this.gameboard.getSquare(this.currentPlayer.position);
    }

    useMovesUntilBranch() {
        while (!(this.getCurrentSquare().isMultiDirector())) {
            // There should only be 2 options in this scenario. may want to enforce.
            // Find the key that is not equal to the given key. This is the direction you did not come from.
            const nextDirection = this.getAvailableDirections()[0];
            // Automatically move to that space, since there's no choice available.
            this.currentPlayer.moveOnce(nextDirection);
            // If we are out of moves, there's no decision left to make. Call the square's functionality.
            if (this.currentPlayer.movesLeft <= 0) {
                return this.activateSquare();
            }
        }
        // Now we are at a branch point. Return the options so the player can make a choice.
        return this.getAvailableDirections();
    }

    /**
     * Retrieves the directions available to the current player from their current position.
     * @return {Array<Direction>} The list of available directions.
     */
    getAvailableDirections() {
        const currentPlayerNeighbors = this.gameboard.getNeighbors(this.currentPlayer.position);
        // Filter out the direction that the player just came from.
        return Object.keys(currentPlayerNeighbors).filter(k => k !== this.currentPlayer.previousSquareDirection);
    }

    /**
     * This is part of use case 2.
     * This should be called by the API route handling the button indicating player's choice of direction at an intersection.
     * Allows the current player to pick a direction to move to the next square position.
     * Updates their position.
     * @param {Direction} direction - The direction to move the player in.
     */
    pickDirection(direction) {
        this.currentPlayer.moveOnce(direction);
        if (this.currentPlayer.movesLeft <= 0) {
            this.activateSquare();
        } else {
            this.useMovesUntilBranch();
        }
    }

    /**
     * Used when landing on a square. The return value should prompt the user with a corresponding UI.
     * @returns 
     */
    activateSquare() {
        if (this.getCurrentSquare().isRollAgain) {
            return "ROLL AGAIN"; // This should prompt the player to roll the die again.
        } else if (this.getCurrentSquare().isCenter) {
            return this.categories; // This should prompt the player to choose a category.
        } else {
            return this.getQuestion();
        }
    }

    /**
     * Get a question from the category that corresponds to the color of the square that the current player is on.
     * @return {Question} The question for the current player.
     */
    getQuestion() {
        const color = this.getCurrentSquare().getColor();
        const category = this.selectCategory(color)
        this.currentQuestion = category.pickRandomQuestion();
        return this.currentQuestion;
    }

    /**
     * This is part of use case 4.
     * This should be called by the API route handling the buttons indicating player's choice of category at the center square.
     * Allows a player to select a category based on a color.
     * @param {Color} color - The color representing the category.
     * @return {Category} The selected category.
     */
    selectCategory(color) {
        return this.categories[color];
    }

    /**
     * Get a list of available category colors.
     * @return {Array<Color>} The list of available colors.
     */
    getColors() {
        return Object.keys(this.categories);
    }

    /**
     * This is part of use cases 3 and 4.
     * This should be called by the API route handling the buttons indicating player's choice of answer when presented with a question.
     * Evaluates if the given answer is correct.
     * @param {string} answer - The player's answer.
     * @return {boolean} True if the answer is correct, otherwise false.
     */
    evaluateAnswer(answer) {
        const correctAnswer = this.currentQuestion.getAnswer()
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
     * @return {} An Object if the game was won. `null` otherwise.
     */
    acknowledgeAnswer() {
        isCorrect = this.recentlyAnsweredCorrectly;
        if (isCorrect) {
            if (this.getSquare().isHQ) {
                this.awardPoints();
            }
            if (this.getSquare().isCenter && this.checkForWinner()) {
                return this.endGame() // End use case 4 if player has won
            }
            // This player's turn continues.
        } else {
            this.endTurn();
        }
        return null; // End use cases 3 or 4
    }

    /**
     * Awards points to the current player based on the question they answered.
     */
    awardPoints() {
        const color = this.getSquare().getColor();
        this.currentPlayer.awardPoints(color);
    }

    /**
     * Checks if the current player has won the game.
     * @return {boolean} True if the current player has won, otherwise false.
     */
    checkForWinner() {
        return this.currentPlayer.isWinner();
    }

    /**
     * Returns the final game state. Should be used at the end of the game.
     * @return {Object} The final game state.
     */
    endGame() {
        return {
            "players": this.players,
            "winner": this.currentPlayer
        };
    }
}
