import { doc, deleteDoc } from "firebase/firestore";

///////////////////
// Delete Functions 
///////////////////

async function deleteQuestion(firebase_db, categoryName, questionID) {
    try {

        await deleteDoc(doc(firebase_db, "categories", categoryName, "questions", questionID))
        return { success: true, message: `Deleted Category: ${categoryName}` };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function deleteCategory(firebase_db, categoryName) {
    try {
        await deleteDoc(doc(firebase_db, "categories", categoryName))
        return { success: true, message: `Deleted Category: ${categoryName}` };
    } catch (err) {
        return { success: false, message: error.message };
    }

}

export { deleteQuestion, deleteCategory }