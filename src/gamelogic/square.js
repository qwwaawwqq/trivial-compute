import { Color } from './color.js';

/**
 * Class representing a square on the game board.
 */
export class Square {

    /**
     * Create a square with specified attributes.
     * 
     * @param {number} position - The position of the square on the board.
     * @param {Object<string, number>} neighbors - An object mapping direction keys to neighbor positions.
     * @param {Color} [color=Color.WHITE] - The color of the square.
     * @param {boolean} [isHQ=false] - Whether the square is a HQ square.
     * @param {boolean} [isCenter=false] - Whether the square is the center square.
     * @param {boolean} [isRollAgain=false] - Whether landing on this square allows rolling again.
     * @param {boolean} [isIntersection] - Whether or not this space has more than 2 neighbors.
     */
    constructor(position, neighbors, color = Color.WHITE, isHQ = false, isCenter = false, isRollAgain = false) {
        this._position = position;
        this._neighbors = neighbors;
        this._color = color;
        this._isHQ = isHQ;
        this._isCenter = isCenter;
        this._isRollAgain = isRollAgain;
    }

    get position() { return this._position; }
    get neighbors() { return this._neighbors; }
    get color() { return this._color; }
    get isHQ() { return this._isHQ; }
    get isCenter() { return this._isCenter; }
    get isRollAgain() { return this._isRollAgain; }
    get isIntersection() { return Object.keys(this._neighbors).length > 2; }

}
