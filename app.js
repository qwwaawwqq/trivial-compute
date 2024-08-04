import express from 'express';
import multer from "multer"
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { initializeApp } from 'firebase/app';


// From Source
import { createNewUser, signInUser, sessionAuth, signOutUser } from './src/firebase/fire-auth.js';
import { createNewCategory, addTextOpenEndedQuestionToCategory, addTextMultipleChoiceQuestionToCategory, addMediaQuestionToCategory } from './src/firebase/questions/create-questions.js'
import { readQuestionsFromCategory, readAllCategories } from './src/firebase/questions/read-questions.js'
import { updateQuestion } from './src/firebase/questions/update-questions.js'
import { deleteQuestion } from './src/firebase/questions/delete-questions.js'
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"
import { GameSession } from './src/gamelogic/gameSession.js'
import { createNewGameSession } from './src/firebase/gameSessions/create-game-session.js'



const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Create an Express application
const app = express();
// Define the port the server will listen on
const port = 8080;


const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

const firebaseConfig = {
    apiKey: "AIzaSyAK9l1ryus6gxNmgsNQU0XZxpwNrBI456Q",
    authDomain: "caffeinecoders-e8219.firebaseapp.com",
    databaseURL: "https://caffeinecoders-e8219-default-rtdb.firebaseio.com",
    projectId: "caffeinecoders-e8219",
    storageBucket: "caffeinecoders-e8219.appspot.com",
    messagingSenderId: "406914685671",
    appId: "1:406914685671:web:bb55c156d2dbea6a18a042",
    measurementId: "G-Z0ZWEKEMTB"
};


// Endpoint to get Firebase config
app.get('/firebase-config', (req, res) => {
    res.json(firebaseConfig);
});

// Initialize Firebase with the given configuration
const firebase = initializeApp(firebaseConfig);
export const firebase_db = getFirestore()
export const firebase_storage = getStorage()

// Use body-parser middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Middleware to log details of each request
app.use(function (req, res, next) {
    const { url, path: routePath } = req;
    console.log('Request: Timestamp:', new Date().toLocaleString(), ', URL (' + url + '), PATH (' + routePath + ').');
    next();
});


// Serve static files from the 'public' directory
app.use(express.static('public'))

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});


///////////////////
// Game Logic
//////////////////

// Store the Dictionary of active session objects THIS IS VERY IMPORTANT
/**
 * An object where each key is a string representing a unique identifier,
 * and each value is an instance of the GameSession class.
 * 
 * @type {Object<string, GameSession>}
 */
app.locals.activeGameSession = {};

// TODO add error handling for game routes
app.post('/api/startGame', (req, res) => {
    try {
        const { categoryNames, playerNames } = req.body;
        GameSession.create(categoryNames, playerNames).then(newGame => {
            app.locals.activeGameSession[newGame.GameSessionID] = newGame;
            const gameStartData = {
                id: newGame.GameSessionID,
                board: newGame.gameboard.toJSON()
            }
            res.status(200).send(gameStartData);
        });
        

        // TODO add back the updates of gamesession to the database. for now rely on the app.locals copy.
        // createNewGameSession(newGame, (result) => {
        //     if (result.success) {
        // res.status(200).send(newGame.GameSessionID);
        //     } else {
        //         res.status(203).send(result.error);
        //     }
        // });

    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }

});

// TODO select the correct CRUD names for each game route

app.post('/api/game/rollDie', (req, res) => {
    const { gameSessionID } = req.body;
    const gameSession = app.locals.activeGameSession[gameSessionID];
    const rollResultAndDirectionOptionsData = gameSession.rollDie();
    res.status(200).send(rollResultAndDirectionOptionsData);
});

app.post('/api/game/pickDirection', (req, res) => {
    const { gameSessionID, direction } = req.body;
    const gameSession = app.locals.activeGameSession[gameSessionID];
    const movementEndData = gameSession.pickDirection(direction);
    res.status(200).send(movementEndData);
});

app.post('/api/game/evaluateAnswer', (req, res) => {
    const { gameSessionID, answer } = req.body;
    const gameSession = app.locals.activeGameSession[gameSessionID];
    const correctAnswerData = gameSession.evaluateAnswer(answer);
    res.status(200).send(correctAnswerData);
});

app.post('/api/game/acknowledgeAnswer', (req, res) => {
    const { gameSessionID } = req.body;
    const gameSession = app.locals.activeGameSession[gameSessionID];
    const gameEndData = gameSession.acknowledgeAnswer();
    res.status(200).send(gameEndData);
});

app.post('/api/game/selectCategory', (req, res) => {
    const { gameSessionID, color } = req.body;
    const gameSession = app.locals.activeGameSession[gameSessionID];
    const questionData = gameSession.selectCategory(color);
    res.status(200).send(questionData);
});

// TODO THIS IS HOW WE WILL MAKE FUNCTIONS CALL TO OUR GAMESESSION ONJ app.locals.activeGameSesson[GameSessionID].startTurn()
app.get('/api/activeGameSessions', (req, res) => {
    try {
        const { GameSessionID } = req.body;
        console.log(app.locals.activeGameSesson[GameSessionID].startTurn())
        res.status(200).send(app.locals.activeGameSesson);
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }

})




/// ////////////////
// Firebase Auth
/// ///////////////

// Route to create a new user account
app.post('/api/createNewAccount', (req, res) => {
    try {
        const { email, password, name } = req.body;
        createNewUser(email, password, name, (result) => {
            if (result.success) {
                res.status(200).send(result.userId);
            } else {
                res.status(203).send(result.error);
            }
        });
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }

});


// Route to sign in an existing user
app.post('/api/login', (req, res) => {
    try {
        const { email, password } = req.body;
        signInUser(email, password, (result) => {
            if (result.success) {
                res.status(200).json({ success: true, userId: result.userId });
            } else {
                res.status(203).json({ success: false, error: result.error });
            }
        });
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }

});


// Route to sign out the current user
app.post('/api//signOut', (req, res) => {
    try {
        signOutUser((result) => {
            if (result.success) {
                res.status(200).send(result.message);
            } else {
                res.status(500).send(result.error);
            }
        });
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }

});




// /// ////////////////////
// // Firebase Fire Store
// /// ///////////////////

// Read Endpoints
app.get("/api/readAllCategories", (req, res) => {
    try {
        readAllCategories((result) => {
            if (result.success) {
                res.status(200).send(result.data);
            } else {
                res.status(500).send(result.error);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});



app.post("/api/readQuestionsFromCategory", (req, res) => {
    try {
        const { categoryName } = req.body;
        readQuestionsFromCategory(categoryName, (result) => {
            if (result.success) {
                res.status(200).send(result.data);
            } else {
                res.status(500).send(result.error);
            }
        });
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }

});



// Create endpoints
app.put('/api/createNewCategory', (req, res) => {
    const { categoryName, creatorName } = req.body;
    createNewCategory(categoryName, creatorName, (result) => {
        if (!res.headersSent) {
            if (result.success) {
                res.status(200).send({ success: true, message: result.message });
            } else {
                res.status(500).send({ success: false, error: result.error });
            }
        }
    });
});


app.put('/api/addTextOpenEndedQuestionToCategory', (req, res) => {
    try {
        const { categoryName, difficultyLevel, creator, answer, question, choices } = req.body;
        addTextOpenEndedQuestionToCategory(categoryName, difficultyLevel, creator, answer, question, (result) => {
            if (result.success) {
                res.status(200).send(result.message);
            } else {
                res.status(500).send(result.error);
            }
        });
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }
});

app.put('/api/addTextMultipleChoiceQuestionToCategory', (req, res) => {
    try {
        const { categoryName, difficultyLevel, creator, answer, question, choices } = req.body;
        addTextMultipleChoiceQuestionToCategory(categoryName, difficultyLevel, creator, question, answer, choices, (result) => {
            if (result.success) {
                res.status(200).send(result.message);
            } else {
                res.status(500).send(result.error);
            }
        });
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }

});

app.post('/api/addMediaQuestionToCategory', upload.single("file"), (req, res) => {
    try {
        const { categoryName, difficultyLevel, creator, answer, question, type } = req.body;
        addMediaQuestionToCategory(categoryName, difficultyLevel, creator, answer, req.file, question, type, (result) => {
            if (result.success) {
                res.status(200).send(result.message);
            } else {
                res.status(500).send(result.error);
            }
        });
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }
});


// Update enpoints
app.put('/updateQuestion', (req, res) => {
    try {
        const { categoryName, questionId, updateDetails } = req.body;
        updateQuestion(categoryName, questionId, updateDetails, (result) => {
            if (result.success) {
                res.status(200).send(result.message);
            } else {
                res.status(500).send(result.error);
            }
        });
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }

});


// Delete Enpoints
app.delete('/updateQuestion', (req, res) => {
    try {
        const { categoryName, questionID } = req.body;
        deleteQuestionn(categoryName, questionID, (result) => {
            if (result.success) {
                res.status(200).send(result.message);
            } else {
                res.status(500).send(result.error);
            }
        });
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }
});

app.delete('/api/deleteCategory', (req, res) => {
    try {
        const { categoryName } = req.body;
        deleteCategory(categoryName, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }
});

app.delete('/api/deleteQuestion', (req, res) => {
    try {
        const { categoryName, questionID } = req.body;
        deleteQuestion(categoryName, questionID, (result) => {
            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(500).json(result);
            }
        });
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message)
    }
});


