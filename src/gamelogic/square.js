import { Color } from './color.js';
import { SquareType } from './squareType.js';

/**
 * Class representing a square on the game board.
 */
export class Square {

    /**
     * Create a square with specified attributes.
     * 
     * @param {number} position - The position of the square on the board.
     * @param {Object<string, number>} [neighbors={}] - An object mapping direction keys to neighbor positions.
     * @param {Color} [color=Color.CLEAR] - The color of the square.
     * @param {SquareType} squareType - The type of the square - this determines what happens when you land on it.
     * @param {boolean} [isIntersection] - Whether or not this space has more than 2 neighbors.
     */
    constructor(position, neighbors = {}, color = Color.WHITE, squareType = SquareType.NORMAL) {
        this._position = position;
        this._neighbors = neighbors;
        this._color = color;
        this._squareType = squareType;
    }

    get position() { return this._position; }
    get neighbors() { return this._neighbors; }
    get color() { return this._color; }
    get squareType() { return this._squareType; }
    get isHQ() { return this._squareType === SquareType.HQ; }
    get isCenter() { return this._squareType === SquareType.CENTER; }
    get isRollAgain() { return this._squareType === SquareType.ROLL_AGAIN; }
    get isIntersection() { return Object.keys(this._neighbors).length > 2; }

    toJSON() {
        return {
            color: this.color,
            squareType: this.squareType,
        }
    }

}
