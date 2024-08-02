import { doc, setDoc, onSnapshot, getDoc, collection } from 'firebase/firestore'
import { ref, uploadBytes } from "firebase/storage";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { v4 } from "uuid"
import { readFile } from "fs"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { firebase_db, firebase_storage } from '../../../app.js'

///////////////////
// Create Functions 
///////////////////


function createNewGameSession(gameSession, callback) {
    const categoryRef = doc(collection(firebase_db, 'game-sessions'), gameSession.GameSessionID)
    setDoc(categoryRef, {
        players: gameSession.players
    })
    callback({ success: true, message: "Started New" })
}

export { createNewGameSession }