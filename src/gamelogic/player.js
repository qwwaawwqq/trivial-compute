import { Board } from './board.js';
import { Color } from './color.js';
import { Direction } from './direction.js';
import { QuestionStats } from './questionStats.js';

/**
 * Custom error for invalid directions.
 */
class InvalidDirectionError extends Error {
    /**
     * Create an InvalidDirectionError.
     * @param {string} message - The error message.
     */
    constructor(message) {
        super(message);
        this.name = 'InvalidDirectionError';
    }
}

/**
 * Class representing a player in the game.
 */
export class Player {
    /**
     * The default score object for a player.
     * @type {Object<Color, boolean>}
     */
    static DEFAULT_SCORE = { [Color.RED]: false, [Color.BLUE]: false, [Color.GREEN]: false, [Color.YELLOW]: false };

    /**
     * Create a player.
     * @param {string} name - The name of the player.
     * @param {string} tokenColor - The color of the player's token.
     * @param {string|null} [grade=null] - The grade of the player.
     * @param {string|null} [email=null] - The email of the player.
     * @param {int} [position=Board.CENTER_POSITION] - The starting position of the player.
     * @param {Object<Color, boolean>} [score=Player.DEFAULT_SCORE] - The score of the player.
     */
    constructor(name, tokenColor, grade = null, email = null, position = Board.CENTER_POSITION, score = null) {
        this.name = name;
        this.tokenColor = tokenColor;
        this.grade = grade;
        this.email = email;
        this.position = position;
        this._score = {...Player.DEFAULT_SCORE};
        this.stats = {}; // object<string for category name, QuestionStats>
        /**
         * Compared to my current position, which direction was this player's previous square in?
         * @type {string|null}
         */
        this.previousSquareDirection = null;
        /**
         * Moves left for the player.
         * @type {int}
         */
        this.movesLeft = 0;
    }

    get score() { return this._score; }

    /**
     * Award a point to the player for the specified color.
     * @param {Color} color - The color for which to award a point.
     */
    awardPoint(color) {
        this._score[color] = true;
    }

    /**
     * Move the player in the specified direction by one unit.
     * @param {Direction} direction - The direction to move the player in.
     * @throws {InvalidDirectionError} Thrown when an invalid direction is requested.
     */
    moveOnce(direction) {
        this.movesLeft -= 1;
        switch (direction) {
            case Direction.UP:
                this.position -= 10;
                this.previousSquareDirection = Direction.DOWN;
                break;
            case Direction.DOWN:
                this.position += 10;
                this.previousSquareDirection = Direction.UP;
                break;
            case Direction.LEFT:
                this.position -= 1;
                this.previousSquareDirection = Direction.RIGHT;
                break;
            case Direction.RIGHT:
                this.position += 1;
                this.previousSquareDirection = Direction.LEFT;
                break;
            default:
                throw new InvalidDirectionError("Requested invalid direction");
        }
    }

    /**
     * Check if the player has won.
     * @param {int} [points_to_win=4] - The number of points required to win.
     * @return {boolean} True if the player has won, otherwise false.
     */
    isWinner(points_to_win = 4) {
        let points = 0;
        for (const color in Player.DEFAULT_SCORE) {
            if (this.score[color]) {
                points++;
            }
        }
        return points >= points_to_win;
    }

    toJSON() {
        return {
            name: this.name,
            tokenColor: this.tokenColor,
            grade: this.grade,
            email: this.email,
            position: this.position,
            score: this.score,
            previousSquareDirection: this.previousSquareDirection,
            movesLeft: this.movesLeft
        }
    }
}
