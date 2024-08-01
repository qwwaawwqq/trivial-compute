import { getFirestore, doc, setDoc, onSnapshot, getDoc, collection } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { v4 } from "uuid"

///////////////////
// Create Functions 
///////////////////

async function createNewCategory(categoryName, creatorName, callback) {
    const db = getFirestore();
    const categoryRef = doc(collection(db, 'categories'), categoryName)
    setDoc(categoryRef, {
        creatorName: creatorName
    })
    callback({ success: true, message: "Added New Category" })
}

function addTextOpenEndedQuestionToCategory(categoryName, difficultyLevel, creator, answer, question, callback) {
    const db = getFirestore();
    const questionId = v4()
    setDoc(doc(db, 'categories', categoryName, "questions", questionId), {
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
    callback({ success: true, message: "Create New Text Open Ended Questions" })
}

function addTextMultipleChoiceQuestionToCategory(categoryName, difficultyLevel, creator, question, answer, choices, callback) {
    const db = getFirestore();
    const questionId = v4()
    setDoc(doc(db, 'categories', categoryName, "questions", questionId), {
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
    callback({ success: true, message: "Create New Text Multiple Choice Questions" })
}

function addVideoQuestionToCategoy(categoryName, questionDetails, video, callback) {


    callback({ "success": true, "message": "Created Video Quesiton" })
}

function addImageQuestionToCategory(categoryName, questionDetails, image, callback) {

    callback({ "success": true, "message": "Created Quesiton" })
}


function addAudioQuestionToCategory(categoryName, questionDetails, audio, callback) {

    callback({ "success": true, "message": "Created Quesiton" })
}


export { createNewCategory, addTextOpenEndedQuestionToCategory, addTextMultipleChoiceQuestionToCategory, addImageQuestionToCategory, addVideoQuestionToCategoy, addAudioQuestionToCategory }