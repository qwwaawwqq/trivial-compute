import { firebase_db, firebase_storage } from '../../app.js'
import { doc, setDoc, onSnapshot, getDoc, collection } from 'firebase/firestore'
import { Board } from './board.js'
import { Direction } from './direction.js'
import { Category } from './category.js'
import { Color } from './color.js'
import { GameSession } from './gameSession.js'

import { boardFactory } from './factory.js'




// Category.create("sports").then((category) => console.log(category));
// Board.create().then((board) => console.log(board.squares));
// GameSession.create(
//     {
//         [Color.RED]: "art-literature",
//         [Color.BLUE]: "econ",
//         [Color.GREEN]: "music",
//         [Color.YELLOW]: "sports"
//     },
//     [
//         "player1",
//         "player2",
//         "player3",
//         "player4"
//     ]
// ).then((gs) => console.log(gs))

/**
 * GET
 */
// const docRef = doc(firebase_db, 'board', 'board');
// getDoc(docRef).then((docSnap) => {
//     if (docSnap.exists()) {
//         console.log('Document data:', docSnap.data());
//     } else {
//         console.log('No such document!');
//     }
// }).catch((error) => {
//     console.error('Error getting document:', error);
// });




// /**
//  * GET ALL
//  */

// // import { getFirestore, collection, getDocs } from 'firebase/firestore';

// // const db = getFirestore();
// // const colRef = collection(db, 'collectionName');

// // getDocs(colRef).then((querySnapshot) => {
// //   const documents = [];
// //   querySnapshot.forEach((doc) => {
// //     documents.push({ id: doc.id, ...doc.data() });
// //   });
// //   console.log('Documents:', documents);
// // }).catch((error) => {
// //   console.error('Error getting documents:', error);
// // });



// /**
//  * SET
//  */

const docRef = doc(firebase_db, 'board', 'board');

setDoc(docRef, boardFactory()).then(() => {
  console.log('Document successfully written!');
}).catch((error) => {
  console.error('Error writing document:', error);
});


