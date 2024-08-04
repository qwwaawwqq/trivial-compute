import { QuestionType } from './questionType.js'
import { QuestionStats } from './questionStats.js'

import { OpenEndedTextQuestion } from './openEndedTextQuestion.js'
import { MultipleChoiceTextQuestion } from './multipleChoiceTextQuestion.js'
import { ImageQuestion } from './imageQuestion.js'
import { AudioQuestion } from './audioQuestion.js'
import { VideoQuestion } from './videoQuestion.js'

import { readQuestionsFromCategoryOnce } from '../firebase/questions/read-questions.js'

class InvalidQuestionTypeReadError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidQuestionTypeReadError';
    }
}

export class Category {
    static create(name) {
        return readQuestionsFromCategoryOnce(name)
            .then(questionsData => {
                
                const questions = []
                for (const questionData of questionsData) {
                    const question = this.instantiateQuestionSubclass(questionData);
                    questions.push(question)
                }

                console.log("HERE")
                
                let category = new Category(name);
                category.questions = questions;
                
                // TODO - get the questions out of the category data
                // Translate stored JSON in database to local objects.


                return category;
            })
            .catch(error => {
                console.error(`Error creating category ${name}:`, error);
                throw new Error(`Error creating category ${name}.`);
            });
    }

    static instantiateQuestionSubclass(questionObject) {
        // TODO align JSON and attribute naming, and questionType enum
        const questionTitle = questionObject["question"];
        const questionStats = new QuestionStats(
            questionObject["timesAsked"],
            questionObject["correctlyAnswerCount"]
        )
        const dateCreated = questionObject["dataCreate"]
        const difficultyLevel = questionObject["difficultyLevel"]
        const creator = questionObject["creator"]
        const answer = questionObject["answer"]
        const questionType = questionObject["typeType"]
        
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

    constructor(name) {
        this.name = name;
        this.questions = [];
    }

    // constructor(name) {
    //     this.name = name;
        
    //     // TODO replace with db call
    //     const qs1 = new QuestionStats(5, 3); 
    //     const qs2 = new QuestionStats(6, 2); 
    //     const oetq = new OpenEndedTextQuestion("q1", qs1, "someDate", "easy", "your mom", "a1");
    //     const mctq = new MultipleChoiceTextQuestion("q2", qs2, "anotherDate", "medium", "your father in heaven", "a2");
    //     this.questions = [
    //         oetq, mctq
    //     ];
    // }

    pickRandomQuestion() {
        const randomIndex = Math.floor(Math.random() * this.questions.length);
        return this.questions[randomIndex];
    }


}
