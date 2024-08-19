import { getFirestore, doc, setDoc, onSnapshot, getDoc, collection } from 'firebase/firestore'

class MissingBoardDataError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MissingBoardDataError';
    }
}

/////////////////
// Read Functions 
//////////////////
/**
 * Reads board from the Firestore database. 
 * Returns a promise.
 */
function readBoard(firestore) {
    const docRef = doc(firestore, 'board', 'board');
    return getDoc(docRef)
    .then(docSnap => {
        if (docSnap.exists()) {
            const boardData = docSnap.data();
            console.log('Loaded board');
            return boardData;
        } else {
            console.log('Failed to find board');
            return null;
        }
    })
    .catch(error => {
        console.error('Error getting document:', error);
        throw new MissingBoardDataError(`Could not find board data in Firestore Database at /board/board: ${error}`);
    });
}

export { readBoard }