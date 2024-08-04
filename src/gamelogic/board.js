import { Color } from './color.js'

import { Square } from './square.js'

import { readBoard } from '../firebase/board/read-board.js'

class InvalidPositionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidPositionError';
    }
}

/**
 * Class representing a game board.
 */
export class Board {
    static CENTER_POSITION = 44;

    /**
     * Do not directly access the constructor.
     * Create a Board by using `Board.create()` instead.
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
                    const isRollAgain = squareData?.["isRollAgain"] === true;
                    const isHQ = squareData?.["isHQ"] === true;
                    const isCenter = squareData?.["isCenter"] === true;
    
                    const square = new Square(position, neighbors, color, isHQ, isCenter, isRollAgain);
                    board.squares[position] = square;
                }
    
                return board;
            })
            .catch(error => {
                console.error('Error creating board:', error);
                throw new Error('Error creating board.');
            });
    }


    getSquare(position) {
        if (!(position in this.squares)) {
            throw new InvalidPositionError("Invalid position on board specified.");
        }
        return this.squares[position];
    }

    getNeighbors(position) {
        return this.getSquare(position).neighbors;
    }

    getCenterSquare() {
        // TODO what is this for? redundant with information in Square objects
        return this.getSquare(CENTER_POSITION);
    }

    getHQSquares() {
        // TODO what is this for? redundant with information in Square objects
        return {
            [Color.RED]: this.getSquare(4),
            [Color.BLUE]: this.getSquare(84),
            [Color.YELLOW]: this.getSquare(40),
            [Color.GREEN]: this.getSquare(48)
        };
    }

    






    
}



// class Board {
//     constructor(arrayJSON) {
//         // A location on the board is specified as a row and a column, both of which are integers.
//         // The array is essentially a lookup for a square at a location.
//         this.array = arrayJSON;
//     }

//     hasLocation(row, column) {
//         // Verify that this board has a square at the provided row/column location.
//         return this.array[row] && this.array[row][column];
//     }

//     getSquare(row, column) {
//         // Preconditions: The given location is in the board.
//         return this.array[row][column];
//     }

//     calculateNextSteps(row, column, roll) {
//         // Calculate possible next locations.
//         let locationsInRange = [];
//         for (let offset = 0; offset < roll; offset++) {
//             locationsInRange.push([row + offset, column + roll - offset]);
//             locationsInRange.push([row + roll - offset, column - offset]);
//             locationsInRange.push([row - offset, column - (roll - offset)]);
//             locationsInRange.push([row - (roll - offset), column + offset]);
//         }

//         let possibleLocations = [];
//         for (let location of locationsInRange) {
//             if (this.hasLocation(location[0], location[1])) {
//                 possibleLocations.push(location);
//             }
//         }

//         return possibleLocations;
//     }
// }



