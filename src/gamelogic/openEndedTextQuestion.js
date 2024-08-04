import { Question } from './question.js'
import { QuestionType } from './questionType.js'

/**
 * Represents a specific type of question where players provide open-ended text responses.
 * @extends Question
 */
export class OpenEndedTextQuestion extends Question {
    /**
     * @param {string} questionTitle - The title or text of the question.
     * @param {QuestionStats} questionStats - Statistics related to the question.
     * @param {string} dateCreated - The date when the question was created.
     * @param {string} difficultyLevel - The difficulty level of the question.
     * @param {string} creator - The name or identifier of the creator.
     * @param {string} answer - The correct answer to the question.
     */
    constructor(questionTitle, questionStats, dateCreated, difficultyLevel, creator, answer) {
        super(QuestionType.FREE_TEXT, questionTitle, questionStats, dateCreated, difficultyLevel, creator, answer);
    }
}