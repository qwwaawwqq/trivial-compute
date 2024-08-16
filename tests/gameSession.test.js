import { GameSession } from '../src/gamelogic/gameSession.js';
import { firebaseConfig } from '../src/firebase/firebaseConfig.js';
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

let firebaseApp;

beforeAll(() => {
    firebaseApp = initializeApp(firebaseConfig);
});

test('Create gameSession with 4 players and 4 categories by name', () => {
    firebaseApp = initializeApp(firebaseConfig);
    const playerNames = ["Abel", "Cain", "Abel2", "Cain2"];
    const categoryNames = ["Art & Literature", "Geography", "History", "Sports & Leisure"];

    const firebase_db = getFirestore();
    
    GameSession.create(categoryNames, playerNames, firebase_db).then(game => {

        // TODO put test code in here
        // This block is what should run after the Promise made by the `create` method completes.
        // That Promise resolves to the GameSession instance named `game`.
        console.log(game.toJSON());

    });

})

afterAll(async () => {
    await firebaseApp.delete();
});