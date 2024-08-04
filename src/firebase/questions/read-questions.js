import { firebase_db, firebase_storage } from '../../../app.js'
import { getFirestore, doc, setDoc, onSnapshot, getDoc, collection, getDocs } from 'firebase/firestore'


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
 * Reads questions from a specified category in a Firestore database without subscribing.
 * @param {string} categoryName - The name of the category to retrieve questions from.
 */
function readQuestionsFromCategoryOnce(categoryName) {
    const collectionRef = collection(firebase_db, 'categories', categoryName, 'questions');
    return getDocs(collectionRef)
    .then(querySnap => {
        let questions = [];
        querySnap.forEach((doc) => {
            questions.push(doc.data())
        })
        return questions;
    })
    .catch(error => {
        console.error('Error getting document:', error);
        throw new MissingBoardDataError(`Could not find category data in Firestore Database: ${error}`);
    });
}
//     onSnapshot(collection(firebase_db, 'categories', categoryName, "questions"), (querySnapshot) => {
//         let questions = []
//         querySnapshot.forEach((doc) => {
//             questions.push(doc.data())
//         })
//         callback({ success: true, data: questions })
//     })
// }

/**
 * Reads all categories from a Firestore database.
 * @param {function} callback - A callback function to handle the retrieved data.
 */
function readAllCategories(callback) {
    onSnapshot(collection(firebase_db, 'categories'), (querySnapshot) => {
        let categories = []
        querySnapshot.forEach((doc) => {
            categories.push(doc.id)
        })
        callback({ success: true, data: categories })
    })
}




export { readQuestionsFromCategory, readQuestionsFromCategoryOnce, readAllCategories }