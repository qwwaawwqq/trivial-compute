import { firebase_db, firebase_storage } from '../../../app.js'
import { query, doc, setDoc, onSnapshot, getDoc, collection, getDocs } from 'firebase/firestore'


/////////////////
// Read Functions 
//////////////////


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
            let question = doc.data()
            question["uuid"] = doc.id
            questions.push(question);
        });
        return { success: true, data: questions };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function readAllQuestions() {
    try {
        const categories = await readAllCategories()
        let allQuestions = []
        for (const category of categories.data) {
            const questionPerCategory = await readQuestionsFromCategory(category)
            for (const question in questionPerCategory.data) {
                const questionDetailsFull = questionPerCategory.data[question]
                questionDetailsFull["category"] = category
                allQuestions.push(questionDetailsFull)
            }
        }
        return { success: true, data: allQuestions };
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






export { readQuestionsFromCategory, readQuestionsFromCategoryOnce, readAllCategories, readAllQuestions }