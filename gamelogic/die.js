
export class Die {
    constructor() {
        // A die can be rolled to generate a random number.
    }

    roll(low = 1, high = 6) {
        // Return a randomly generated integer in the range between inputs low to high inclusive.
        return Math.floor(Math.random() * high) + low;
    }
}

