import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { initializeApp } from 'firebase/app';

// From Source
import { createNewUser, signInUser, sessionAuth, signOutUser } from './src/firebase/fire-auth.js';
import { createNewCategory, addTextQuestionToCategory, addImageQuestionToCategory, addVideoQuestionToCategoy, addAudioQuestionToCategory } from './src/firebase/questions/create-questions.js'
import { readAllQuestions, readQuestionsFromCategory, readQuestion, readAllCategories } from './src/firebase/questions/read-questions.js'
import { updateQuestion } from './src/firebase/questions/update-questions.js'
import { deleteQuestion } from './src/firebase/questions/delete-questions.js'


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

/// ////////////////
// Firebase Auth
/// ///////////////

// Route to create a new user account
app.post('/createNewAccount', (req, res) => {
    const { email, password, name } = req.body;
    createNewUser(email, password, name, (result) => {
        if (result.success) {
            res.status(200).send(result.userId);
        } else {
            res.status(203).send(result.error);
        }
    });
});


// Route to sign in an existing user
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    signInUser(email, password, (result) => {
        if (result.success) {
            res.status(200).json({ success: true, userId: result.userId });
        } else {
            res.status(203).json({ success: false, error: result.error });
        }
    });
});


// Route to sign out the current user
app.post('/signOut', (req, res) => {
    signOutUser((result) => {
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(500).send(result.error);
        }
    });
});




// /// ////////////////////
// // Firebase Fire Store
// /// ///////////////////

// Read Enpoints
app.get("/readAllQuestions", (req, res) => {
    readAllQuestions((result) => {
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(500).send(result.error);
        }
    });
});

app.get("/readAllCategories", (req, res) => {
    readAllCategories((result) => {
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(500).send(result.error);
        }
    });
});

app.post("/readQuestionsFromCategory", (req, res) => {
    const { categoryName } = req.body;
    readQuestionsFromCategory(categoryName, (result) => {
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(500).send(result.error);
        }
    });
});

app.post("/readQuestion", (req, res) => {
    const { categoryName, questionID } = req.body;
    readQuestion(categoryName, questionID, (result) => {
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(500).send(result.error);
        }
    });

});

// Create enpoints
app.put('/createNewCategory', (req, res) => {
    const { categoryName, creatorName, } = req.body;
    createNewCategory(categoryName, creatorName, (result) => {
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(500).send(result.error);
        }
    });
});

app.put('/addTextQuestionToCategory', (req, res) => {
    const { categoryName, questionDetails } = req.body;
    addTextQuestionToCategory(categoryName, questionDetails, (result) => {
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(500).send(result.error);
        }
    });
});

app.put('/addImageQuestionToCategory', (req, res) => {
    const { categoryName, questionDetails, image } = req.body;
    addImageQuestionToCategory(categoryName, questionDetails, image, (result) => {
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(500).send(result.error);
        }
    });
});

app.put('/addVideoQuestionToCategory', (req, res) => {
    const { categoryName, questionDetails, video } = req.body;
    addVideoQuestionToCategoy(categoryName, questionDetails, video, (result) => {
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(500).send(result.error);
        }
    });
});

app.put('/addAudioQuestionToCategory', (req, res) => {
    const { categoryName, questionDetails, audio } = req.body;
    addAudioQuestionToCategory(categoryName, questionDetails, audio, (result) => {
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(500).send(result.error);
        }
    });
});

// Update enpoints
app.put('/updateQuestion', (req, res) => {
    const { categoryName, questionId, updateDetails } = req.body;
    updateQuestion(categoryName, questionId, updateDetails, (result) => {
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(500).send(result.error);
        }
    });
});


// Delete Enpoints
app.delete('/updateQuestion', (req, res) => {
    const { categoryName, questionID } = req.body;
    deleteQuestionn(categoryName, questionID, (result) => {
        if (result.success) {
            res.status(200).send(result.message);
        } else {
            res.status(500).send(result.error);
        }
    });
});