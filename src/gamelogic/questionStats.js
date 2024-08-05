/**
 * Provides functionality to track and update statistics related to questions.
 */
export class QuestionStats {
    /**
     * Initializes the question statistics.
     * @param {number} timesAsked - The number of times the question has been asked.
     * @param {number} timesCorrectlyAnswered - The number of times the question has been answered correctly.
     */
    constructor(timesAsked = 0, timesCorrectlyAnswered = 0) {
        this.timesAsked = timesAsked;
        this.timesCorrectlyAnswered = timesCorrectlyAnswered;
    }

    /**
     * Updates the statistics based on whether the answer was correct or not.
     * @param {boolean} correct - Indicates whether the answer was correct.
     */
    updateStats(correct) {
        this.timesAsked++;
        if (correct) {
            this.timesCorrectlyAnswered++;
        }
    }

    /**
     * Calculates and returns the percentage of correct answers.
     * @returns {number} - The percentage of correct answers.
     */
    get percentCorrect() {
        if (this.timesAsked === 0) {
            return 0;
        } 
        return (this.timesCorrectlyAnswered / this.timesAsked) * 100;
    }

    toJSON() {
        return {
            timesAsked: this.timesAsked,
            timesCorrectlyAnswered: this.timesCorrectlyAnswered,
            percentCorrect: this.percentCorrect
        }
    }
}