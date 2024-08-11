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
async function createNewCategory(categoryName, creatorName, callback) {
    try {
        const categoryRef = doc(collection(firebase_db, 'categories'), categoryName);
        await setDoc(categoryRef, { creatorName: creatorName });
        return { success: true, message: "Added New Category" };
    } catch (error) {
        return { success: false, message: error.message };
    }
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
async function addTextOpenEndedQuestionToCategory(categoryName, difficultyLevel, creator, answer, question) {
    try {
        const questionId = v4()
        await setDoc(doc(firebase_db, 'categories', categoryName, "questions", questionId), {
            dateCreatd: Date.now(),
            difficultyLevel: difficultyLevel,
            timeAsked: 0,
            correctlyAnswerCount: 0,
            creator: creator,
            answer: answer,
            questionType: "text",
            textType: 'openEnded',
            question: question
        })
        return { success: true, data: "Created New Text Open Ended Questions" }
    } catch (error) {
        return { success: false, error: "Cannot Create New Question" }
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
async function addTextMultipleChoiceQuestionToCategory(categoryName, difficultyLevel, creator, question, answer, choices) {
    try {
        const questionId = v4()
        await setDoc(doc(firebase_db, 'categories', categoryName, "questions", questionId), {
            dateCreatd: Date.now(),
            difficultyLevel: difficultyLevel,
            timeAsked: 0,
            correctlyAnswerCount: 0,
            creator: creator,
            answer: answer,
            questionType: "text",
            textType: 'multipleChoice',
            question: question,
            choice: choices
        })
        return { success: true, data: "Created New Text Multiple Choice Questions" }
    } catch (error) {
        return { success: false, error: "Cannot Create New Text Multiple Choice Questions" }
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

        const storageRef = ref(firebase_storage, `${type.toLowerCase()}/${file.originalname + "_" + v4()}`);
        const storagePath = storageRef._location.path_
        const questionId = v4()
        const metadata = {
            contentType: file.mimetype
        }

        uploadBytes(storageRef, file.buffer, metadata).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });

        setDoc(doc(firebase_db, 'categories', categoryName, "questions", questionId), {
            dateCreated: Date.now(),
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
        console.log(error)
        callback({ success: false, message: "Cannot Create New Text Multiple Choice Questions" })
    }
}


export { createNewCategory, addTextOpenEndedQuestionToCategory, addTextMultipleChoiceQuestionToCategory, addMediaQuestionToCategory }