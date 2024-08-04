import { Color } from './color.js';
import { Square } from './square.js';
import { readBoard } from '../firebase/board/read-board.js';

/**
 * Custom error for invalid positions.
 */
class InvalidPositionError extends Error {
    /**
     * Create an InvalidPositionError.
     * @param {string} message - The error message.
     */
    constructor(message) {
        super(message);
        this.name = 'InvalidPositionError';
    }
}

/**
 * Class representing a game board.
 */
export class Board {
    /**
     * The center position on the board.
     * @type {number}
     */
    static CENTER_POSITION = 44;

    /**
     * Factory method to create a new Board instance.
     * @return {Promise<Board>} A promise that resolves to a Board instance.
     */
    static create() {
        let board = new Board();
        return readBoard()
            .then(boardData => {
                console.log('here', boardData);

                // Translate stored JSON in database to local objects.
                board.squares = {};
                for (let position in boardData) {
                    const squareData = boardData[position];
                    const neighbors = squareData["neighbors"];
                    const color = squareData["color"];
                    const squareType = squareData["type"];

                    const square = new Square(position, neighbors, color, squareType);
                    board.squares[position] = square;
                }

                return board;
            })
            .catch(error => {
                console.error('Error creating board:', error);
                throw new Error('Error creating board.');
            });
    }

    /**
     * DO NOT DIRECTLY INVOKE EXTERNALLY - please use Board.create() instead.
     * Constructs a new Board instance.
     */
    constructor() {}

    /**
     * Get the square at a specified position.
     * @param {number} position - The position on the board.
     * @return {Square} The square at the specified position.
     * @throws {InvalidPositionError} Thrown when an invalid position is specified.
     */
    getSquare(position) {
        if (!(position in this.squares)) {
            throw new InvalidPositionError("Invalid position on board specified.");
        }
        return this.squares[position];
    }

    /**
     * Get the neighbors of a square at a specified position.
     * @param {number} position - The position on the board.
     * @return {Object<string, number>} The neighbors of the square at the specified position.
     */
    getNeighbors(position) {
        return this.getSquare(position).neighbors;
    }

    // TODO What are these for? They seem redundant with information in Square objects.
    // In what use case would we want to retrieve them directly?

    // /**
    //  * Get the center square of the board.
    //  * @return {Square} The center square of the board.
    //  */
    // getCenterSquare() {
    //     
    //     return this.getSquare(Board.CENTER_POSITION);
    // }

    // /**
    //  * Get the headquarters squares of the board.
    //  * @return {Object<string, Square>} The headquarters squares for each color.
    //  */
    // getHQSquares() {
    //     // TODO what is this for? redundant with information in Square objects
    //     return {
    //         [Color.RED]: this.getSquare(4),
    //         [Color.BLUE]: this.getSquare(84),
    //         [Color.YELLOW]: this.getSquare(40),
    //         [Color.GREEN]: this.getSquare(48)
    //     };
    // }

    toJSON() {
        const json = {};
        for (position in this.squares) {
            json[position] = this.squares[position].toJSON();
        }
        return json;
    }

}
