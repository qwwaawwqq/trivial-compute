import { QuestionStats } from './questionStats.js'

import { QuestionType } from './questionType.js'

/**
 * Abstract class representing a question.
 */
export class Question {
    /**
     * @param {QuestionType} typeOfQuestion - The type of the question.
     * @param {string} questionTitle - The title or text of the question.
     * @param {QuestionStats} questionStats - Statistics related to the question.
     * @param {string} dateCreated - The date when the question was created.
     * @param {string} difficultyLevel - The difficulty level of the question.
     * @param {string} creator - The name or identifier of the creator.
     * @param {string} answer - The correct answer to the question.
     */
    constructor(typeOfQuestion, questionTitle, questionStats, dateCreated, difficultyLevel, creator, answer) {
        if (new.target === Question) {
            throw new Error("Question is an abstract class, which should not be instantiated directly.");
        }
        this.typeOfQuestion = typeOfQuestion;
        this.questionTitle = questionTitle;
        this.questionStats = questionStats;
        this.dateCreated = dateCreated;
        this.difficultyLevel = difficultyLevel;
        this.creator = creator;
        this._answer = answer;
    }

    /**
     * Returns the correct answer to the question.
     * @returns {string} - The correct answer.
     */
    get answer() {
        return this._answer;
    }

    toJSON() {
        return this;
        // return {
        //     typeOfQuestion: this.typeOfQuestion,
        //     questionTitle: this.questionTitle,
        //     questionStats: this.questionStats.toJSON(),
        //     dateCreated: this.dateCreated,
        //     difficultyLevel: this.difficultyLevel,
        //     creator: this.creator,
        //     answer: this.answer
        // }
    }
}
