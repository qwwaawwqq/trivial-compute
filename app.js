import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import { initializeApp } from 'firebase/app';
import { createNewUser, signInUser, sessionAuth, signOutUser } from './src/firebase/fire-auth.js';
// import { writeNewQuestion, readUserQuestions, readAllQuestions, readQuestion, updateQuestion } from './firebase/fire-questions.js';

const app = express();
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

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    const { url, path: routePath } = req;
    console.log('Request: Timestamp:', new Date().toLocaleString(), ', URL (' + url + '), PATH (' + routePath + ').');
    next();
});

// Serve static files
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});

/// ////////////////
// Firebase Auth
/// ///////////////
// app.post('/authenticateRoute', (req, res) => {
//     const sessionUID = req.headers.uid;
//     sessionAuth(sessionUID, (result) => {
//         if (result.isLogedIn) {
//             res.status(200).send(result.userId);
//         } else {
//             res.status(203).send(result.error);
//         }
//     });
// });

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

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    signInUser(email, password, (result) => {
        console.log(result)
        if (result.success) {
            res.status(200).send(result.userId);
        } else {
            res.status(203).send(result.error);
        }
    });
});

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
// app.put('/writeNewQuestion', (req, res) => {
//     const { Author, Category, Question, Answer } = req.body;
//     writeNewQuestion(Author, Category, Question, Answer, (result) => {
//         if (result.success) {
//             res.status(200).send({ data: result.data });
//         } else {
//             res.status(203).send('Could Not Add Question');
//         }
//     });
// });

// app.put('/updateQuestion', (req, res) => {
//     const { Author, Category, Question, Answer, QuestionID } = req.body;
//     updateQuestion(Author, Category, Question, Answer, QuestionID, (result) => {
//         if (result.success) {
//             res.status(200).json({ data: result.data });
//         } else {
//             res.status(203).send('Could Not Update Question');
//         }
//     });
// });

// app.get('/readQuestion', async (req, res) => {
//     const questionId = req.query.id;
//     await readQuestion(questionId, (result) => {
//         if (result.success) {
//             res.status(200).json({ data: result.data });
//         } else {
//             res.status(203).send('Could Not Read Question');
//         }
//     });
// });

// app.get('/readUserQuestions', (req, res) => {
//     readUserQuestions((result) => {
//         if (result.success) {
//             res.status(200).send(result.data);
//         } else {
//             res.status(203).send(result.data);
//         }
//     });
// });

// app.get('/getAllQuestions', (req, res) => {
//     readAllQuestions((result) => {
//         if (result.success) {
//             res.status(200).send(result.data);
//         } else {
//             res.status(203).send([]);
//         }
//     });
// });

