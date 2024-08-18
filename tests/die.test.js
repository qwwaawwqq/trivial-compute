import { Die } from '../src/gamelogic/die';

test('dice roll always returns int between 1 and 6 (inclusive).', function() {
    const testDice = new Die();
    const rolls = [];
    const rollCount = 100; // Number of rolls to test the distribution

    for (let i = 0; i < rollCount; i++) {
        const roll = testDice.roll();
        // Ensure the roll is within the range 1 to 6
        expect(roll).toBeGreaterThanOrEqual(1);
        expect(roll).toBeLessThanOrEqual(6);
        rolls.push(roll);
    }

    // Ensure all possible outcomes (1 to 6) are present
    for (let i = 1; i <= 6; i++) {
        expect(rolls).toContain(i);
    }
});