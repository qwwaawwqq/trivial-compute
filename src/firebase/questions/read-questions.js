import { firebase_db, firebase_storage } from '../../../app.js'
import { query, doc, setDoc, onSnapshot, getDoc, collection, getDocs } from 'firebase/firestore'


/////////////////
// Read Functions 
//////////////////
/**
 * Reads questions from a specified category in a Firestore database.
 * @param {string} categoryName - The name of the category to retrieve questions from.
 */
async function readQuestionsFromCategory(categoryName) {
    try {
        const collectionRef = collection(firebase_db, 'categories', categoryName, 'questions');
        const querySnap = await getDocs(collectionRef);
        let questions = [];
        querySnap.forEach((doc) => {
            questions.push(doc.data());
        });
        return { success: true, data: questions };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Reads questions from a specified category in a Firestore database without subscribing.
 * @param {string} categoryName - The name of the category to retrieve questions from.
 */
async function readQuestionsFromCategoryOnce(categoryName) {
    try {
        const collectionRef = collection(firebase_db, 'categories', categoryName, 'questions');
        const querySnap = await getDocs(collectionRef);
        let questions = [];
        querySnap.forEach((doc) => {
            questions.push(doc.data());
        });
        return { success: true, data: questions };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Reads all categories from a Firestore database.
 */
async function readAllCategories() {
    try {
        const q = query(collection(firebase_db, "categories"));
        const querySnapshot = await getDocs(q);
        let categories = []
        querySnapshot.forEach((doc) => {
            categories.push(doc.id)
        });
        return { success: true, data: categories };
    } catch (error) {
        return { success: false, error: error.message };
    }
}




export { readQuestionsFromCategory, readQuestionsFromCategoryOnce, readAllCategories }