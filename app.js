import express from 'express';
import multer from "multer"
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { initializeApp } from 'firebase/app';
import axios from 'axios';


// From Source
import { createNewUser, signInUser, sessionAuth, signOutUser } from './src/firebase/fire-auth.js';
import { createNewCategory, addTextOpenEndedQuestionToCategory, addTextMultipleChoiceQuestionToCategory, addMediaQuestionToCategory } from './src/firebase/questions/create-questions.js'
import { readQuestionsFromCategory, readAllCategories, readAllQuestions,getMediaUrl,fetchMediaContent} from './src/firebase/questions/read-questions.js'
import { updateQuestion, updateCategory } from './src/firebase/questions/update-questions.js'
import { deleteQuestion, deleteCategory } from './src/firebase/questions/delete-questions.js'
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


/**
 * Start the game.
 * Respond to the press of the button that starts the game from the config screen.
 * This is the start of use case 1.
 * @param {Object<Color, string>} categoryNames - The names of the categories. Each key should be a Color (see color.js for valid values). Each value should be the name of a category corresponding to that color. This object must have exactly 4 entries.
 * @param {Array<string>} playerNames - The names of the players. Each entry is a player's name. This array's length must be between 1-4.
 * @returns {Object} A map of the following:
 *      @property {string} gameSessionID - A unique ID corresponding to the newly created GameSession. All API calls related to this game must provide this ID.
 *      @property {Object<int, Object>} board - A representation of the board. Each key is a position in a grid, where the one's digit is the column index and the ten's digit is the row index.
 *          @property {Object}
 *              @property {Color} color - A Color (see color.js for valid values) representing this space's color.
 *              @property {SquareType} type - A SquareType (see squareType.js for valid values) representing this space's type, determining what happens when a player lands on it.
 *      @property {string} currentPlayerName - The name of the current player. Can be used to determine the initial state of the turn indicator.
 *      @property {Array<Object<Color, string>>} initialScores - The initial scores of each player. 
 */
app.post('/api/startGame', (req, res) => {
    try {
        const { categoryNames, playerNames } = req.body;
        GameSession.create(categoryNames, playerNames).then(newGame => {
            app.locals.activeGameSession[newGame.GameSessionID] = newGame;

            const initialScores = [];
            for (let i = 0; i < newGame.players.length; i++) {
                initialScores.push(newGame.players[i].score);
            }

            const gameStartData = {
                gameSessionID: newGame.GameSessionID,
                board: newGame.gameboard.toJSON(),
                currentPlayer: newGame.currentPlayer.name,
                initialScores: initialScores
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

/**
 * Simulates rolling the die and determines the available directions for the current player.
 * Respond to the press of the button that rolls the die.
 * This is the start of use case 2.
 * @param {string} gameSessionID - A unique ID corresponding to the ongoing GameSession, as generated when the game started.
 * @returns {Object} An object containing:
 *   @property {int} roll - The result of the die roll, representing the number of moves left for the current player.
 *   @property {Array<Direction>} availableDirections - The list of Directions (see direction.js for valid values) available for the player from their current position.
 */
app.put('/api/game/rollDie', (req, res) => {
    const { gameSessionID } = req.body;
    const gameSession = app.locals.activeGameSession[gameSessionID];
    const rollResultAndDirectionOptionsData = gameSession.rollDie();
    res.status(200).send(rollResultAndDirectionOptionsData);
});

/**
 * Execute the player's movement after picking a direction.
 * Responds to the press of the button indicating player's choice of direction.
 * This is part of use case 2.
 * The output format depends heavily on where the player ends up:
 *      If squareType is null, then the player has hit an intersection so check availableDirections for where the player can go, and then prompt them to pick one of those directions.
 *      Otherwise, if squareType is SquareType.NORMAL or SquareType.HQ, then check question for the question to present to the player, and then prompt them to answer that question.
 *      Otherwise, if squareType is SquareType.ROLL_AGAIN, then prompt the player to roll the die again.
 *      Otherwise, if squareType is SquareType.CENTER,  then check categoryOptions for what categories can be chosen by the player, and then prompt them to pick a category.
 * @param {string} gameSessionID - A unique ID corresponding to the ongoing GameSession, as generated when the game started.
 * @param {Direction} direction - The Direction (see direction.js for valid values) in which the player wants to move.
 * @returns {Object} An object containing the path and relevant decision information:
 *      @property {Array<int>} path - An array of positions the player has moved through. This includes both their starting and final positions.
 *      @property {int} currentPlayerIndex - The index of the current player. Can be used to determine which player's token to move.
 *      @property {SquareType|null} squareType - The type of the current square if the player has run out of moves, otherwise null.
 *      @property {Object<Color, string>|null} categoryOptions - An object mapping Colors to categories if the square type is CENTER, otherwise null.
 *      @property {Object|null} question - An object representing a question if the square type is NORMAL, otherwise null. See the Question subclass definitions for the fields.
 *      @property {Array<Direction>} availableDirections - An array of available directions if the player is at an intersection, otherwise an empty array.
 */
app.put('/api/game/pickDirection', (req, res) => {
    const { gameSessionID, direction } = req.body;
    const gameSession = app.locals.activeGameSession[gameSessionID];
    const movementEndData = gameSession.pickDirection(direction);
    res.status(200).send(movementEndData);
});

/**
 * Check if the player's choice is correct, and send back what the correct answer is.
 * Responds to the buttons indicating player's choice of answer when presented with a question.
 * This is part of use cases 3 and 4.
 * @param {string} gameSessionID - A unique ID corresponding to the ongoing GameSession, as generated when the game started.
 * @param {string} answer - The player's answer.
 * @return {Object} An object with the correct answer and whether the player's answer is correct.
 *      @property {string} correctAnswer - The correct answer to the question.
 *      @property {boolean} isCorrect - Whether or not the player answered correctly.
 */
app.put('/api/game/evaluateAnswer', (req, res) => {
    const { gameSessionID, answer } = req.body;
    const gameSession = app.locals.activeGameSession[gameSessionID];
    const correctAnswerData = gameSession.evaluateAnswer(answer);
    res.status(200).send(correctAnswerData);
});

/**
 * Triggers actions that should happen after the player has viewed the correct answer.
 * This is part of use cases 3 and 4, towards the end.
 * Responds to the acknowledgement button that should display when the game is displaying the correct answer feedback.
 * This output format depends on whether or not the player has now won the game:
 *      If endGameData is not null, then the current player won, so display the endgame screen with the provided information in endGameData.
 *      Otherwise, if score is not null, then the current player scored a point, so update the scoreboard identified by scoreboardToUpdate with the score, and then prompt the player named nextPlayerName to roll a die.
 *      Otherwise, the current player did not score a point, so just prompt the player named nextPlayerName to roll a die.
 * @param {string} gameSessionID - A unique ID corresponding to the ongoing GameSession, as generated when the game started.
 * @return {Object} An object containing the following:
 *      @property {Object | null} endGameData - If the game is over, this will contain data about the game. Otherwise, it will be null. Decide whether to continue the game or not based on this.
 *      @property {string | null} nextPlayerName - the player whose turn is up next. Used to populate the turn display. If the game is over, or if the player didn't score a point, this isn't populated.
 *      @property {int | null} scoreboardToUpdate - Identifies which scoreboard to update. Between 0-3. If the game is over, or if the player didn't score a point, this isn't populated.
 *      @property {Object<Color, boolean> | null} score - New score to put into the scoreboard identified by scoreboardToUpdate.
 */
app.put('/api/game/acknowledgeAnswer', (req, res) => {
    const { gameSessionID } = req.body;
    const gameSession = app.locals.activeGameSession[gameSessionID];
    const scoreOrEndData = gameSession.acknowledgeAnswer();
    res.status(200).send(scoreOrEndData);
});

/**
 * Respond to the buttons indicating player's choice of category at the center square.
 * This is part of use case 4.
 * @param {string} gameSessionID - A unique ID corresponding to the ongoing GameSession, as generated when the game started.
 * @param {Color} color - The color representing the category.
 * @return {Object} An object representing a question from the selected category. See Question subclass definitions for what is in it.
 */
app.put('/api/game/selectCategory', (req, res) => {
    const { gameSessionID, color } = req.body;
    const gameSession = app.locals.activeGameSession[gameSessionID];
    const questionData = gameSession.selectCategory(color);
    res.status(200).send(questionData);
});


/**
 * Check if the player's choice is correct, and send back what the correct answer is.
 * Responds to the buttons indicating player's choice of answer when presented with a question.
 * This is part of use cases 3 and 4.
 * @param {string} gameSessionID - A unique ID corresponding to the ongoing GameSession, as generated when the game started.
 * @return {Object} An object with the correct answer and whether the player's answer is correct.
 *      @property {string} correctAnswer - The correct answer to the question.
 */
app.put('/api/game/showAnswer', (req, res) => {
    const { gameSessionID } = req.body;
    const gameSession = app.locals.activeGameSession[gameSessionID];
    const correctAnswerData = gameSession.showAnswer();
    res.status(200).send(correctAnswerData);
});

/**
 * Triggers actions that should happen after the player has viewed the correct answer.
 * This is part of use cases 3 and 4, towards the end.
 * Responds to the acknowledgement button that should display when the game is displaying the correct answer feedback.
 * This output format depends on whether or not the player has now won the game:
 *      If endGameData is not null, then the current player won, so display the endgame screen with the provided information in endGameData.
 *      Otherwise, if score is not null, then the current player scored a point, so update the scoreboard identified by scoreboardToUpdate with the score, and then prompt the player named nextPlayerName to roll a die.
 *      Otherwise, the current player did not score a point, so just prompt the player named nextPlayerName to roll a die.
 * @param {string} gameSessionID - A unique ID corresponding to the ongoing GameSession, as generated when the game started.
 * @param {boolean} isCorrect - Whether or not the player answered correctly.
 * @return {Object} An object containing the following:
 *      @property {Object | null} endGameData - If the game is over, this will contain data about the game. Otherwise, it will be null. Decide whether to continue the game or not based on this.
 *      @property {string | null} nextPlayerName - the player whose turn is up next. Used to populate the turn display. If the game is over, or if the player didn't score a point, this isn't populated.
 *      @property {int | null} scoreboardToUpdate - Identifies which scoreboard to update. Between 0-3. If the game is over, or if the player didn't score a point, this isn't populated.
 *      @property {Object<Color, boolean> | null} score - New score to put into the scoreboard identified by scoreboardToUpdate.
 */
app.put('/api/game/judgeAnswer', (req, res) => {
    const { gameSessionID, isCorrect } = req.body;
    const gameSession = app.locals.activeGameSession[gameSessionID];
    const scoreOrEndData = gameSession.judgeAnswer(isCorrect);
    res.status(200).send(scoreOrEndData);
});





/**
 * Get the category and player names that were used to initialize the game session.
 * @param {string} gameSessionID - A unique ID corresponding to the ongoing GameSession, as generated when the game started.
 * @returns {Object} An object containing:
 *      @param {Object<Color, string>} categoryNames - The names of the categories. Each key should be a Color (see color.js for valid values). Each value will be the name of a category corresponding to that color. This object will have exactly 4 entries.
 *      @param {Array<string>} playerNames - The names of the players. Each entry is a player's name. This array's length will be between 1-4.
 */
app.get('/api/game/names', (req, res) => {
    const { gameSessionID } = req.query;
    const gameSession = app.locals.activeGameSession[gameSessionID];
    const namesData = gameSession.names;
    res.status(200).send(namesData);
});

/**
 * Save this game session to the Firestore under gameSessions.
 * @param {string} gameSessionID - A unique ID corresponding to the ongoing GameSession, as generated when the game started.
 */
app.post('/api/game/save', (req, res) => {
    const { gameSessionID } = req.body;
    const gameSession = app.locals.activeGameSession[gameSessionID];
    console.log("HEY");
    console.log(gameSessionID);
    gameSession.saveJSON();
    res.status(200).send();
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
app.post('/api/signOut', (req, res) => {
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
// Get Media URL Endpoint
app.get("/api/getMediaUrl", async (req, res) => {
    const { filePath } = req.query;

    if (!filePath) {
        return res.status(400).json({ success: false, message: 'filePath query parameter is required' });
    }

    try {
        const url = await getMediaUrl(filePath);
        res.status(200).json({ success: true, url });
    } catch (error) {
        console.error('Error fetching media URL:', error);
        res.status(500).json({ success: false, message: 'Failed to get media URL' });
    }
});

// Fetch Media Content Endpoint
app.get("/api/fetchMediaContent", async (req, res) => {
    const { filePath } = req.query;

    if (!filePath) {
        return res.status(400).json({ success: false, message: 'filePath query parameter is required' });
    }

    try {
        // Get the download URL for the file
        const downloadURL = await getMediaUrl(filePath);

        // Fetch the media file as a stream
        const response = await axios.get(downloadURL, { responseType: 'stream' });

        // Set appropriate headers
        res.setHeader('Content-Type', response.headers['content-type']);
        res.setHeader('Content-Length', response.headers['content-length']);

        // Pipe the stream directly to the response
        response.data.pipe(res);
    } catch (error) {
        console.error('Error fetching media content:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch media content' });
    }
});

// Read Endpoints
app.get("/api/readAllQuestions", async (req, res) => {
    try {
        const result = await readAllQuestions()
        if (result.success) {
            res.status(200).send(result.data);
        } else {
            res.status(500).send(result.error);
        }
    } catch (error) {
        console.log(console.log(error))
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


app.get("/api/readAllCategories", async (req, res) => {
    try {
        const result = await readAllCategories()
        if (result.success) {
            res.status(200).send(result.data);
        } else {
            res.status(500).send(result.error);
        }
    } catch (error) {
        console.log(console.log(error))
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


app.post("/api/readQuestionsFromCategory", async (req, res) => {
    try {
        const { categoryName } = req.body;
        const result = await readQuestionsFromCategory(categoryName)
        if (result.success) {
            res.status(200).send(result.data);
        } else {
            res.status(500).send(result.error);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

});



// Create endpoints
app.put('/api/createNewCategory', async (req, res) => {
    const { categoryName, creatorName } = req.body;

    try {
        const result = await createNewCategory(categoryName, creatorName);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


app.put('/api/addTextOpenEndedQuestionToCategory', async (req, res) => {
    try {
        const { categoryName, difficultyLevel, creator, answer, question, choices } = req.body;
        const result = await addTextOpenEndedQuestionToCategory(categoryName, difficultyLevel, creator, answer, question, choices)
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.put('/api/addTextMultipleChoiceQuestionToCategory', async (req, res) => {
    try {
        const { categoryName, difficultyLevel, creator, answer, question, choices } = req.body;
        const result = await addTextMultipleChoiceQuestionToCategory(categoryName, difficultyLevel, creator, question, answer, choices)
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

});

app.put('/api/addMediaQuestionToCategory', upload.single("file"), (req, res) => {
    try {
        const { categoryName, difficultyLevel, creator, answer, question, type } = req.body;
        addMediaQuestionToCategory(categoryName, difficultyLevel, creator, answer, req.file, question, type, (result) => {
            if (result.success) {
                res.status(200).send(result.message);
            } else {
                console.log(result.error)
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

// Update enpoints
app.put('/api/updateCategory', async (req, res) => {
    try {
        const { oldName, newName } = req.body;
        const result = await updateCategory(oldName, newName)
        if (result.success) {
            res.status(200).json(result);
        } else {
            console.log
            res.status(500).json(result.error);
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

});


// Delete Enpoints
app.delete('/api/deleteQuestions', async (req, res) => {
    try {
        const { categoryName, questionID } = req.body;
        const result = await deleteQuestion(categoryName, questionID)
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.delete('/api/deleteCategory', async (req, res) => {
    try {
        const { categoryName } = req.body;
        const result = await deleteCategory(categoryName)
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/api/deleteQuestion', async (req, res) => {
    try {
        const { category, questionId } = req.body;
        const result = await deleteQuestion(category, questionId)
        if (result.success) {
            res.status(200).json(result);
        } else {
            console.log(result)
            res.status(500).json(result);
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


