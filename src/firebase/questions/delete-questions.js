import { firebase_db, firebase_storage } from '../../../app.js'
import { doc, deleteDoc } from "firebase/firestore";

///////////////////
// Delete Functions 
///////////////////

function deleteQuestion(categoryName, questionID, callback) {

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