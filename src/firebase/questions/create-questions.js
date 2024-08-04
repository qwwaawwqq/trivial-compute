import { doc, setDoc, onSnapshot, getDoc, collection } from 'firebase/firestore'
import { ref, uploadBytes } from "firebase/storage";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { v4 } from "uuid"
import { readFile } from "fs"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { firebase_db, firebase_storage } from '../../../app.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
///////////////////
// Create Functions 
///////////////////


/**
 * Function to create a new category in the Firestore database.
 * 
 * @param {string} categoryName - The name of the category to create.
 * @param {string} creatorName - The name of the creator of the category.
 * @param {function} callback - The callback function to execute after creating the category.
 */
function createNewCategory(categoryName, creatorName, callback) {
    const categoryRef = doc(collection(firebase_db, 'categories'), categoryName)
    setDoc(categoryRef, {
        creatorName: creatorName
    })
    callback({ success: true, message: "Added New Category" })
}

/** 
 * Function to add a text open-ended question to a category.
 * 
 * @param {string} categoryName - The name of the category to add the question to.
 * @param {string} difficultyLevel - The difficulty level of the question.
 * @param {string} creator - The name of the creator of the question.
 * @param {string} answer - The answer to the question.
 * @param {string} question - The question text.
 * @param {function} callback - The callback function to execute after adding the question.
 */
function addTextOpenEndedQuestionToCategory(categoryName, difficultyLevel, creator, answer, question, callback) {
    try {
        const questionId = v4()
        setDoc(doc(firebase_db, 'categories', categoryName, "questions", questionId), {
            dataCreate: Date.now(),
            difficultyLevel: difficultyLevel,
            timeAsked: 0,
            correctlyAnswerCount: 0,
            creator: creator,
            answer: answer,
            questionType: "text",
            typeType: 'openEnded',
            question: question
        })
        callback({ success: true, message: "Created New Text Open Ended Questions" })
    } catch (error) {
        callback({ success: false, message: "Cannot Create New Question" })
    }
}

/** 
 * Function to add a text multiple choice question to a category.
 * 
 * @param {string} categoryName - The name of the category to add the question to.
 * @param {string} difficultyLevel - The difficulty level of the question.
 * @param {string} creator - The name of the creator of the question.
 * @param {string} question - The question text.
 * @param {string} answer - The answer to the question.
 * @param {Array<string>} choices - The choices for the multiple choice question.
 * @param {function} callback - The callback function to execute after adding the question.
 */
function addTextMultipleChoiceQuestionToCategory(categoryName, difficultyLevel, creator, question, answer, choices, callback) {
    try {
        const questionId = v4()
        setDoc(doc(firebase_db, 'categories', categoryName, "questions", questionId), {
            dataCreate: Date.now(),
            difficultyLevel: difficultyLevel,
            timeAsked: 0,
            correctlyAnswerCount: 0,
            creator: creator,
            answer: answer,
            questionType: "text",
            typeType: 'multipleChoice',
            question: question,
            choice: choices
        })
        callback({ success: true, message: "Created New Text Multiple Choice Questions" })
    } catch (error) {
        callback({ success: false, message: "Cannot Create New Text Multiple Choice Questions" })
    }

}

/** 
 * Adds an image question to a specified category in Firestore.
 *
 * @param {string} categoryName - The name of the category to add the question to.
 * @param {string} difficultyLevel - The difficulty level of the question.
 * @param {string} creator - The creator of the question.
 * @param {string} answer - The correct answer to the question.
 * @param {Object} file - The image file object to be uploaded.
 * @param {string} file.originalname - The original name of the file.
 * @param {Buffer} file.buffer - The file data in buffer form.
 * @param {string} file.mimetype - The MIME type of the file.
 * @param {string} question - The question text.
 * @param {function} callback - The callback function to execute after attempting to add the question.
 */
function addMediaQuestionToCategory(categoryName, difficultyLevel, creator, answer, file, question, type, callback) {
    try {
        const storageRef = ref(firebasee_storage, `${type}/${file.originalname + "_" + v4()}`);
        const storagePath = storageRef._location.path_
        const db = getFirestore();
        const questionId = v4()
        const metadata = {
            contentType: file.mimetype
        }

        uploadBytes(storageRef, file.buffer, metadata).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });

        setDoc(doc(firebase_db, 'categories', categoryName, "questions", questionId), {
            dataCreate: Date.now(),
            difficultyLevel: difficultyLevel,
            timeAsked: 0,
            correctlyAnswerCount: 0,
            creator: creator,
            answer: answer,
            questionType: type,
            question: question,
            fileLocation: storagePath
        })
        callback({ success: true, message: "Created New Image Question" })
    } catch (error) {
        callback({ success: false, message: "Cannot Create New Text Multiple Choice Questions" })
    }
}


export { createNewCategory, addTextOpenEndedQuestionToCategory, addTextMultipleChoiceQuestionToCategory, addMediaQuestionToCategory }