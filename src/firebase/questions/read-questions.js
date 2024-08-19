// import { firebase_db, firebase_storage } from '../../../app.js'
import { firebase_db, firebase_storage } from '../../../app.js';
import { query, doc, setDoc, onSnapshot, getDoc, collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import axios from 'axios';


/////////////////
// Read Functions 
//////////////////


/**
 * Reads all categories from a Firestore database.
 */
async function readAllCategories(firebase_db) {
    try {
        const q = query(collection(firebase_db, "categories"));
        const querySnapshot = await getDocs(q);
        let categories = []
        console.log("HELLO");
        console.log(categories);
        querySnapshot.forEach((doc) => {
            categories.push(doc.id)
        });
        return { success: true, data: categories };
    } catch (error) {
        return { success: false, error: error.message };
    }
}



/**
 * Reads questions from a specified category in a Firestore database.
 * @param {string} categoryName - The name of the category to retrieve questions from.
 */
async function readQuestionsFromCategory(db, categoryName) {
    try {
        const categoryRef = doc(db, 'categories', categoryName);
        const categoryDoc = await getDoc(categoryRef);

        if (!categoryDoc.exists()) {
            return { success: false, error: 'Category not found' };
        }

        const questionsRef = collection(db, 'categories', categoryName, 'questions');
        const questionsSnapshot = await getDocs(questionsRef);

        const questions = [];
        questionsSnapshot.forEach((doc) => {
            questions.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, data: questions };
    } catch (error) {
        console.error('Error reading questions:', error);
        return { success: false, error: error.message };
    }
}

async function readAllQuestions(firebase_db) {
    try {
        const categories = await readAllCategories(firebase_db)
        let allQuestions = []
        for (const category of categories.data) {
            const questionPerCategory = await readQuestionsFromCategory(firebase_db, category)
            for (const question in questionPerCategory.data) {
                const questionDetailsFull = questionPerCategory.data[question]
                questionDetailsFull["category"] = category
                allQuestions.push(questionDetailsFull)
            }
        }
        return { success: true, data: allQuestions };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Reads questions from a specified category in a Firestore database without subscribing.
 * @param {string} categoryName - The name of the category to retrieve questions from.
 */
async function readQuestionsFromCategoryOnce(firebase_db, categoryName) {
    try {
        const collectionRef = collection(firebase_db, 'categories', categoryName, 'questions');
        const querySnap = await getDocs(collectionRef);
        let questions = [];
        querySnap.forEach((doc) => {
            questions.push(doc.data());
        });
        return { success: true, data: questions };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


/**
 * Retrieves the download URL for a media file from Firebase Storage.
 * @param {string} filePath - The path to the file in Firebase Storage.
 * @returns {Promise<string>} A promise that resolves with the download URL.
 */
async function getMediaUrl(filePath) {
    try {
        const fileRef = ref(firebase_storage, filePath);
        const downloadURL = await getDownloadURL(fileRef);
        console.log(`Retrieved download URL for ${filePath}`);
        return downloadURL;
    } catch (error) {
        console.error(`Error getting download URL for ${filePath}:`, error);
        throw new Error(`Failed to get download URL: ${error.message}`);
    }
}

/**
 * Fetches the media content using Axios after retrieving the download URL.
 * @param {string} filePath - The path to the file in Firebase Storage.
 * @returns {Promise<{ data: Buffer, contentType: string, contentLength: string }>} A promise that resolves with the media content as a Buffer, content type, and content length.
 */
async function fetchMediaContent(filePath) {
    try {
        const url = await getMediaUrl(filePath);
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        console.log(`Fetched media content from ${url}`);
        
        // Debug logging
        console.log('Response headers:', response.headers);
        console.log('Response data length:', response.data.length);
        console.log('Response data type:', typeof response.data);
        
        const contentType = response.headers['content-type'] || 'application/octet-stream';
        console.log('Content-Type:', contentType); // Additional debug log
        
        return {
            data: response.data,
            contentType: contentType,
            contentLength: response.headers['content-length']
        };
    } catch (error) {
        console.error(`Error fetching media content from ${filePath}:`, error);
        throw new Error(`Failed to fetch media content: ${error.message}`);
    }
}



export { readQuestionsFromCategory, readQuestionsFromCategoryOnce, readAllCategories, readAllQuestions, getMediaUrl, fetchMediaContent }