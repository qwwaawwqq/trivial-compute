import { QuestionType } from './questionType.js';
import { QuestionStats } from './questionStats.js';

import { OpenEndedTextQuestion } from './openEndedTextQuestion.js';
import { MultipleChoiceTextQuestion } from './multipleChoiceTextQuestion.js';
import { ImageQuestion } from './imageQuestion.js';
import { AudioQuestion } from './audioQuestion.js';
import { VideoQuestion } from './videoQuestion.js';

import { readQuestionsFromCategoryOnce } from '../firebase/questions/read-questions.js';

/**
 * Custom error for invalid question types.
 */
class InvalidQuestionTypeReadError extends Error {
    /**
     * Create an InvalidQuestionTypeReadError.
     * @param {string} message - The error message.
     */
    constructor(message) {
        super(message);
        this.name = 'InvalidQuestionTypeReadError';
    }
}

/**
 * Class representing a category of questions.
 */
export class Category {
    /**
     * Factory method to create a new Category instance.
     * @param {string} name - The name of the category.
     * @return {Promise<Category>} A promise that resolves to a Category instance.
     */
    static create(name) {
        return readQuestionsFromCategoryOnce(name)
            .then(questionsData => {
                let category = new Category(name);
                
                const questions = []
                for (const questionData of questionsData) {
                    const question = this.instantiateQuestionSubclass(questionData);
                    questions.push(question);
                }

                console.log("HERE");
                
                category.questions = questions;

                return category;
            })
            .catch(error => {
                console.error(`Error creating category ${name}:`, error);
                throw new Error(`Error creating category ${name}.`);
            });
    }

    /**
     * Instantiate the appropriate question subclass based on the question type.
     * @param {Object} questionObject - The question object.
     * @return {OpenEndedTextQuestion|MultipleChoiceTextQuestion|ImageQuestion|AudioQuestion|VideoQuestion} The instantiated question subclass.
     * @throws {InvalidQuestionTypeReadError} Thrown when an invalid question type is read.
     */
    static instantiateQuestionSubclass(questionObject) {
        // TODO align JSON and attribute naming, and questionType enum
        const questionTitle = questionObject["question"];
        const questionStats = new QuestionStats(
            questionObject["timesAsked"],
            questionObject["correctlyAnswerCount"]
        );
        const dateCreated = questionObject["dataCreate"];
        const difficultyLevel = questionObject["difficultyLevel"];
        const creator = questionObject["creator"];
        const answer = questionObject["answer"];
        const questionType = questionObject["typeType"];
        
        switch (questionType) {
            case "openEnded":
                return new OpenEndedTextQuestion(
                    questionTitle, 
                    questionStats, 
                    dateCreated, 
                    difficultyLevel, 
                    creator, 
                    answer
                );
            case QuestionType.FREE_TEXT:
                return new OpenEndedTextQuestion(
                    questionTitle, 
                    questionStats, 
                    dateCreated, 
                    difficultyLevel, 
                    creator, 
                    answer
                );
            case QuestionType.MULTIPLE_CHOICE:
                return new MultipleChoiceTextQuestion(
                    questionObject["options"],
                    questionTitle, 
                    questionStats, 
                    dateCreated, 
                    difficultyLevel, 
                    creator, 
                    answer
                );
            case QuestionType.AUDIO:
                return new AudioQuestion(
                    questionObject["audioURL"],
                    questionTitle, 
                    questionStats, 
                    dateCreated, 
                    difficultyLevel, 
                    creator, 
                    answer
                );
            case QuestionType.IMAGE:
                return new ImageQuestion(
                    questionObject["imageURL"],
                    questionTitle, 
                    questionStats, 
                    dateCreated, 
                    difficultyLevel, 
                    creator, 
                    answer
                );
            case QuestionType.VIDEO:
                return new VideoQuestion(
                    questionObject["videoURL"],
                    questionTitle, 
                    questionStats, 
                    dateCreated, 
                    difficultyLevel, 
                    creator, 
                    answer
                );
            default:
                throw new InvalidQuestionTypeReadError("Invalid question type read");
        }
    }

    /**
     * DO NOT DIRECTLY INVOKE EXTERNALLY - please use Category.create() instead.
     * @param {string} name - The name of the category.
     */
    constructor(name) {
        this.name = name;
        this.questions = null; // Populated in create()
    }

    /**
     * Pick a random question from the category.
     * @return {OpenEndedTextQuestion|MultipleChoiceTextQuestion|ImageQuestion|AudioQuestion|VideoQuestion} A random question from the category.
     */
    pickRandomQuestion() {
        const randomIndex = Math.floor(Math.random() * this.questions.length);
        return this.questions[randomIndex];
    }
}
