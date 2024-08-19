import { firebase_db, firebase_storage } from '../../../app.js'
import { getFirestore, doc, setDoc, onSnapshot, collection, getDocs,query, limit } from 'firebase/firestore'
import { ref, getDownloadURL } from 'firebase/storage';

/////////////////
// Read Functions 
//////////////////
/**
 * Reads all questions from all categories in a Firestore database.
 * @param {number} [maxQuestionsPerCategory=100] - Maximum number of questions to retrieve per category (optional).
 * @param {function} callback - A callback function to handle the retrieved data.
 */
async function readAllQuestionsFromAllCategories(maxQuestionsPerCategory = 100, callback) {
    console.log("Starting to read all questions from all categories");
    try {
        const categoriesRef = collection(firebase_db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesRef);
        console.log(`Found ${categoriesSnapshot.size} categories`);

        let allQuestions = [];

        for (const categoryDoc of categoriesSnapshot.docs) {
            const categoryName = categoryDoc.id;
            console.log(`Processing category: ${categoryName}`);
            const questionsRef = collection(firebase_db, 'categories', categoryName, 'questions');
            const q = query(questionsRef, limit(maxQuestionsPerCategory));
            const questionsSnapshot = await getDocs(q);
            console.log(`Found ${questionsSnapshot.size} questions in category ${categoryName}`);

            questionsSnapshot.forEach(doc => {
                allQuestions.push({
                    id: doc.id,
                    category: categoryName,
                    ...doc.data()
                });
            });
        }

        console.log(`Total questions retrieved: ${allQuestions.length}`);
        callback({ 
            success: true, 
            data: allQuestions,
            message: `Retrieved ${allQuestions.length} questions from all categories`
        });
    } catch (error) {
        console.error('Error reading all questions:', error);
        callback({ 
            success: false, 
            error: error.message || 'Unknown error occurred while reading questions'
        });
    }
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

/**
 * Reads all categories from a Firestore database.
 * @param {function} callback - A callback function to handle the retrieved data.
 */
function readAllCategories(callback) {
    const collectionRef = collection(firebase_db, 'categories');
    getDocs(collectionRef)
        .then(querySnap => {
            let categories = [];
            querySnap.forEach((doc) => {
                categories.push(doc.id);
            });
            callback({ success: true, data: categories });
        })
        .catch(error => {
            console.error('Error getting document:', error);
            callback({ success: false, error: error.message });
        });
}




export { readAllQuestionsFromAllCategories , readQuestionsFromCategoryOnce, readAllCategories}