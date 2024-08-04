import { Board } from './board.js'
import { Color } from './color.js'
import { Direction } from './direction.js'

class InvalidDirectionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidDirectionError';
    }
}

export class Player {
    static DEFAULT_SCORE = {[Color.RED]: false, [Color.BLUE]: false, [Color.GREEN]: false, [Color.YELLOW]: false}

    constructor(name, tokenColor, grade = null, email = null, position = Board.CENTER_POSITION, score = this.DEFAULT_SCORE) {
        this.name = name;
        this.tokenColor = tokenColor;
        this.grade = grade;
        this.email = email;
        this.position = position;
        this.score = score;
        // Compared to my current position, which direction was this player's previous square in?
        this.previousSquareDirection = null;
        this.movesLeft = 0;
    }

    /**
     * Move the player to the provided position.
     * @param {int} position 
     *      This position is assumed to be valid - this check should be done at a higher level.
     */
    setPosition(position) {
        this.position = position;
    }

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

    awardPoint(color) {
        this.score[color] = true;
    }

    isWinner(points_to_win = 4) {
        let points = 0;
        for (const color in this.DEFAULT_SCORE) {
            if (this.score[color]) {
                points++;
            }
        }
        return points >= points_to_win;
    }
}