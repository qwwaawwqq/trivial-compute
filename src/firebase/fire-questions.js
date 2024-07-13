import { getFirestore, doc, setDoc, onSnapshot, getDoc, collection } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

function readAllQuestions(callback) {
  const db = getFirestore()
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      onSnapshot(collection(db, 'questions'), (querySnapshot) => {
        const questions = []
        querySnapshot.forEach((doc) => {
          questions.push(doc.data())
        })
        callback({ success: true, data: questions })
      })
    } else {
      callback({ success: false, data: 'Cannot Access Questions' })
    }
  })
}

function readUserQuestions(callback) {
  const db = getFirestore()
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userID = user.uid
      onSnapshot(doc(db, 'users', userID), (doc) => {
        callback({ success: true, data: doc.data() })
      })
    } else {
      callback({ success: false, data: 'Cannot Access User Questions' })
    }
  })
}

function readQuestion(questionID, callback) {
  const db = getFirestore()
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      getDoc(doc(db, 'users', user.uid, 'questions', questionID))
        .then((doc) => {
          callback({ success: true, data: doc.data() })
        })
        .catch(err => {
          console.error(err)
          callback({ success: false, data: err.message })
        })
    } else {
      callback({ success: false, data: 'Cannot Access User Questions' })
    }
  })
}

function writeNewQuestion(Author, Category, Question, Answer, callback) {
  const db = getFirestore()
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userID = user.uid
      const questionReference = doc(collection(db, 'questions'))
      const newQuestionId = questionReference.id
      setDoc(questionReference, {
        questionId: newQuestionId,
        Author: Author,
        Category: Category,
        Question: Question,
        Answer: Answer
      })
      setDoc(doc(db, 'users', userID, 'questions', newQuestionId), {
        questionId: newQuestionId,
        Author: Author,
        Category: Category,
        Question: Question,
        Answer: Answer
      })
      callback({ success: true, data: newQuestionId })
    } else {
      callback({ success: false, data: 'Question was not Uploaded' })
    }
  })
}

/**
 * Updates an existing question in the database
 *
 * @param {String} Author: The author of the question
 * @param {string} Category: The category of the question
 * @param {string} Question: The question text
 * @param {string} Answer: The answer to the question
 * @param {string} QuestionId: The unique ID for the question you want to update
 * @param {function} callback: Callback function that returns the question id on success
 */
function updateQuestion(Author, Category, Question, Answer, QuestionId, callback) {
  const db = getFirestore()
  const auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userID = user.uid
      setDoc(doc(db, 'questions', QuestionId), {
        questionId: QuestionId,
        Author: Author,
        Category: Category,
        Question: Question,
        Answer: Answer
      })
      setDoc(doc(db, 'users', userID, 'questions', QuestionId), {
        questionId: QuestionId,
        Author: Author,
        Category: Category,
        Question: Question,
        Answer: Answer
      })
      callback({ success: true, data: QuestionId })
    } else {
      callback({ success: false, data: 'Question was not Updated' })
    }
  })
}

export { readUserQuestions, readAllQuestions, writeNewQuestion, readQuestion, updateQuestion }