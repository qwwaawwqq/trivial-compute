// import { Board } from './board.js'
// import { Die } from './die.js'
// import { Player } from './player.js'
// import { Question } from './question.js'
// import { Category } from './category.js'
import { v4 } from "uuid"

// import { Direction } from './direction.js'

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
class GameSession {
    /**
     * Create a new game session.
     * @param {Object<string, string>} categoryNames - The game categories associated with different color keys.
     * @param {Array<string>} playerNames - The list of players in the game session.
     * @throws {InvalidPlayerCountError} - Thrown when the number of players is invalid
     * @throws {InvalidCategoryCountError} - Thrown when the number of categories is invalid
     */
    constructor(categoryNames, playerNames) {
        // Ensure inputs are valid. Throw specific exception if not.
        this.validateInputs(categoryNames, playerNames);

        // this.gameboard = new Board();
        // this.die = new Die();

        // this.players = [];
        // for (let i = 0; i < playerNames.length; i++) {
        //     const player = new Player(playerNames[i]);
        //     this.players.push(player);
        // }
        // this.currentPlayerIndex = 0;
        // this.currentPlayer = this.players[this.currentPlayerIndex];

        // this.categories = {};
        // for (const colorName in categoryNames) {
        //     const category = new Category(categoryNames[colorName]);
        //     this.categories[colorName] = category;
        // }

        this.currentQuestion = null;
        this.GameSessionID = v4()
    }

    /**
     * Validate the provided constructor inputs.
     * @param {Object<string, string>} categoryNames - The game categories associated with different colors.
     * @param {Array<string>} playerNames - The list of players in the game session.
     * @throws {InvalidPlayerCountError} - Thrown when the number of players is invalid
     * @throws {InvalidCategoryCountError} - Thrown when the number of categories is invalid
     */
    validateInputs(categoryNames, playerNames) {

        if ((playerNames.length < 1) || (playerNames.length > 4)) {
            throw new InvalidPlayerCountError("There must be between 1-4 players, inclusive.")
        }

        if (Object.keys(categoryNames).length != 4) {
            throw new InvalidCategoryCountError("There must be exactly 4 categories.")
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
     * @return {int} The result of the die roll.
     */
    rollDie() {
        return this.die.roll();
    }

    /**
     * Retrieves the directions available to the current player from their current position.
     * @return {Array<Direction>} The list of available directions.
     */
    getAvailableDirections() {
        return this.gameboard.getAvailableDirections(this.currentPlayer.position);
    }

    /**
     * Allows the current player to pick a direction to move to the next square position.
     * Updates their position.
     * @param {Direction} direction - The direction to move the player in.
     */
    pickDirection(direction) {
        this.currentPlayer.move(direction);
    }

    /**
     * Get a question from the category that corresponds to the color of the square that the current player is on.
     * @return {Question} The question for the current player.
     */
    getQuestion() {
        const color = this.gameboard.getSquare(this.currentPlayer.position).getColor();
        const category = this.selectCategory(color)
        return category.getQuestion();
    }

    /**
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
     * Evaluates if the given answer is correct.
     * @param {string} answer - The player's answer.
     * @return {boolean} True if the answer is correct, otherwise false.
     */
    evaluateAnswer(answer) {
        const correctAnswer = this.currentQuestion.getAnswer()
        return correctAnswer === answer;
    }

    /**
     * Awards points to the current player based on the question they answered.
     */
    awardPoints() {
        const color = this.gameboard.getSquare(this.currentPlayer.position).getColor();
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
     * Ends the game and returns the final game state.
     * @return {Object} The final game state.
     */
    endGame() {
        return {
            "players": this.players,
            "winner": this.currentPlayer
        };
    }
}

export default GameSession