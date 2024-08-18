import { Question } from './question.js'
import { QuestionType } from './questionType.js'

/**
 * Represents a specific type of question where the question or part of the question is provided in a video format.
 * @extends Question
 */
export class VideoQuestion extends Question {
    /**
     * @param {string} fileLocation - The path or URL to the video file.
     * @param {string} questionTitle - The title or text of the question.
     * @param {QuestionStats} questionStats - Statistics related to the question.
     * @param {string} dateCreated - The date when the question was created.
     * @param {string} difficultyLevel - The difficulty level of the question.
     * @param {string} creator - The name or identifier of the creator.
     * @param {string} answer - The correct answer to the question.
     */
    constructor(fileLocation, questionTitle, questionStats, dateCreated, difficultyLevel, creator, answer) {
        super(QuestionType.VIDEO, questionTitle, questionStats, dateCreated, difficultyLevel, creator, answer);
        this.fileLocation = fileLocation;
    }
}