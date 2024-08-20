import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { query, doc, setDoc, onSnapshot, getDoc, collection, getDocs, getFirestore } from 'firebase/firestore';

function createNewUser(email, password, callback) {
    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const userId = userCredential.user.uid
            setDoc(doc(db, "users", userId), {
                email: email,
            });
            callback({ "success": true, "userId": userId })

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            callback({ "success": false, "error": "Could Not Create Account" })
        });
}

async function listTeachers() {
    try {
        const db = getFirestore();
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        let email = []
        querySnapshot.forEach((doc) => {
            email.push(doc.get("email"))
        });
        return { success: true, data: email };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


function signInUser(email, password, callback) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const userId = userCredential.user.uid
            callback({ "success": true, "userId": userId })
        })
        .catch((error) => {
            const errorCode = error.code;
            callback({ "success": false, "error": "Incorrect Login" })
        });
}

function sessionAuth(uid, callback) {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userID = user.uid;
            if (uid == userID) {
                callback({ "isLogedIn": true, "userId": userID })
            } else {
                callback({ "isLogedIn": false, "error": "Not Logged In" })
            }
        } else {
            callback({ "isLogedIn": false, "error": "Not Logged In" })
        }
    });

}

function signOutUser(callback) {
    const auth = getAuth();
    signOut(auth).then(() => {
        callback({ "success": true, "message": "Logged Out" })
    }).catch((error) => {
        callback({ "success": false, "error": "Could Not Log Out" })
    });
}

export { createNewUser, signInUser, sessionAuth, signOutUser, listTeachers }