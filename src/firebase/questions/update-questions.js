import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore'
// import { firebase_db } from '../../../app.js'
///////////////////
// Update Functions 
///////////////////

function updateQuestion(categoryName, questionId, updateDetails, callback) {

}

async function updateCategory(firebase_db, oldCategoryName, nameCategoryName) {
    const oldDocRef = doc(firebase_db, "categories", oldCategoryName);
    const newDocRef = doc(firebase_db, "categories", nameCategoryName);

    try {
        // Get the data from the old document
        const oldDocSnap = await getDoc(oldDocRef);
        if (oldDocSnap.exists()) {
            const data = oldDocSnap.data();
            // Create the new document with the same data
            await setDoc(newDocRef, data);
            // Delete the old document
            await deleteDoc(oldDocRef);
            return { success: true, message: `Document renamed from ${oldCategoryName} to ${nameCategoryName}` };
        } else {
            return { success: false, error: `Document with name ${oldCategoryName} does not exist` };

        }
    } catch (error) {
        return { success: false, error: `Failed to rename document: ${error.message}` };

    }
}

export { updateQuestion, updateCategory }