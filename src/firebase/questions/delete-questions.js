import { firebase_db, firebase_storage } from '../../../app.js'
import { doc, deleteDoc } from "firebase/firestore";

///////////////////
// Delete Functions 
///////////////////

async function deleteQuestion(categoryName, questionID) {
    try {
        await deleteDoc(doc(firebase_db, "categories", categoryName, "questions", questionID))
        return { success: true, message: `Deleted Category: ${categoryName}` };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function deleteCategory(categoryName) {
    try {
        await deleteDoc(doc(firebase_db, "categories", categoryName))
        return { success: true, message: `Deleted Category: ${categoryName}` };
    } catch (err) {
        return { success: false, message: error.message };
    }

}

export { deleteQuestion, deleteCategory }