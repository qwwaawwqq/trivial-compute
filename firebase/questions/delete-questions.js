import { doc, deleteDoc, collection } from 'firebase/firestore';
import { firebase_db } from '../../../app.js';

///////////////////
// Delete Functions 
///////////////////

/**
 * Function to delete a question from a specific category in the Firestore database.
 * 
 * @param {string} categoryName - The name of the category.
 * @param {string} questionID - The ID of the question to delete.
 * @param {function} callback - The callback function to execute after deleting the question.
 */
function deleteQuestion(categoryName, questionID, callback) {
    const questionRef = doc(firebase_db, 'categories', categoryName, 'questions', questionID);
    deleteDoc(questionRef)
        .then(() => {
            callback({ success: true, message: 'Deleted question successfully' });
        })
        .catch((error) => {
            console.error('Error deleting question:', error);
            callback({ success: false, error: error.message });
        });
}

/**
 * Function to delete a category from the Firestore database.
 * 
 * @param {string} categoryName - The name of the category to delete.
 * @param {function} callback - The callback function to execute after deleting the category.
 */
function deleteCategory(categoryName, callback) {
    const categoryRef = doc(firebase_db, 'categories', categoryName);
    deleteDoc(categoryRef)
        .then(() => {
            callback({ success: true, message: 'Deleted category successfully' });
        })
        .catch((error) => {
            console.error('Error deleting category:', error);
            callback({ success: false, error: error.message });
        });
}

export { deleteQuestion, deleteCategory };
