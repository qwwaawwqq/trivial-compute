import { Color } from './color.js'

export class Square {
    constructor(position, neighbors, color = Color.WHITE, isHQ = false, isCenter = false, isRollAgain = false) {
        this.position = position;
        this.neighbors = neighbors;
        this.color = color;
        this.isHQ = isHQ;
        this.isCenter = isCenter;
        this.isRollAgain = isRollAgain;
    }

    isMultipleDirector() {
        return Object.keys(neighbors).length > 2;
    }

    getColor() {
        return this.color;
    }

    getIsHQ() {
        return this.isHQ;
    }

    getIsCenter() {
        return this.isCenter;
    }

    getIsRollAgain() {
        return this.isRollAgain;
    }
}