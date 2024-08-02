import { firebase_db, firebase_storage } from '../../../app.js'
import { getFirestore, doc, setDoc, onSnapshot, getDoc, collection } from 'firebase/firestore'


/////////////////
// Read Functions 
//////////////////
/**
 * Reads questions from a specified category in a Firestore database.
 * @param {string} categoryName - The name of the category to retrieve questions from.
 * @param {function} callback - A callback function to handle the retrieved data.
 */
function readQuestionsFromCategory(categoryName, callback) {
    onSnapshot(collection(firebase_db, 'categories', categoryName, "questions"), (querySnapshot) => {
        let questions = []
        querySnapshot.forEach((doc) => {
            questions.push(doc.data())
        })
        callback({ success: true, data: questions })
    })
}

/**
 * Reads all categories from a Firestore database.
 * @param {function} callback - A callback function to handle the retrieved data.
 */
function readAllCategories(callback) {
    onSnapshot(collection(firebase_db, 'categories'), (querySnapshot) => {
        let categories = []
        querySnapshot.forEach((doc) => {
            categories.push(doc.data())
        })
        callback({ success: true, data: categories })
    })
}


export { readQuestionsFromCategory, readAllCategories }