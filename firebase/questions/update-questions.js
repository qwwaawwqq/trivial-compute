import {  doc, updateDoc, getDoc,setDoc,deleteDoc } from 'firebase/firestore';
import { firebase_db } from '../../../app.js';

///////////////////
// Update Functions 
///////////////////

/**
 * Function to update a question in a specific category in the Firestore database.
 * 
 * @param {string} categoryName - The name of the category (e.g., "Art & Literature").
 * @param {string} questionId - The ID of the question to update.
 * @param {object} updateDetails - The details to update for the question.
 * @param {function} callback - The callback function to execute after updating the question.
 */
async function updateQuestion(categoryName, questionId, updateDetails, callback) {
    if (!categoryName || !questionId || !updateDetails) {
        callback({ success: false, error: 'Invalid parameters' });
        return;
    }

    const questionRef = doc(firebase_db, 'categories', categoryName, 'questions', questionId);
    
    try {
        // First, check if the question exists
        const questionSnapshot = await getDoc(questionRef);
        if (!questionSnapshot.exists()) {
            throw new Error('Question does not exist');
        }

        // Update the question
        await updateDoc(questionRef, updateDetails);
        
        callback({ success: true, message: 'Updated question successfully' });
    } catch (error) {
        console.error('Error updating question:', error);
        callback({ success: false, error: error.message || 'Unknown error occurred' });
    }
}
/**
 * Function to update a category in the Firestore database.
 * 
 * @param {string} categoryName - The name of the category to update.
 * @param {object} updateDetails - The details to update for the category.
 * @param {function} callback - The callback function to execute after updating the category.
 */
async function updateCategory(oldName, updateDetails, callback) {
    if (!oldName || !updateDetails || !updateDetails.name) {
        callback({ success: false, error: 'Invalid parameters' });
        return;
    }

    const oldCategoryRef = doc(firebase_db, 'categories', oldName);
    const newCategoryRef = doc(firebase_db, 'categories', updateDetails.name);
    
    try {
        const oldDocSnapshot = await getDoc(oldCategoryRef);
        if (!oldDocSnapshot.exists()) {
            throw new Error('Category does not exist');
        }

        const oldData = oldDocSnapshot.data();
        await setDoc(newCategoryRef, { ...oldData, name: updateDetails.name });
        await deleteDoc(oldCategoryRef);

        callback({ success: true, message: 'Updated category successfully' });
    } catch (error) {
        console.error('Error updating category:', error);
        callback({ success: false, error: error.message || 'Unknown error occurred' });
    }
}

export { updateQuestion, updateCategory };
