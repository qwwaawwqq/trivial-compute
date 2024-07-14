///////////////////
// Create Functions 
///////////////////

function createNewCategory(categoryName, creatorName, callback) {


    callback({ "success": true, "message": "Created New Category" })
}

function addTextQuestionToCategory(categoryName, questionDetails, callback) {


    callback({ "success": true, "message": "Created Text Quesiton" })
}

function addVideoQuestionToCategoy(categoryName, questionDetails, video, callback) {


    callback({ "success": true, "message": "Created Video Quesiton" })
}

function addImageQuestionToCategory(categoryName, questionDetails, image, callback) {

    callback({ "success": true, "message": "Created Quesiton" })
}


function addAudioQuestionToCategory(categoryName, questionDetails, audio, callback) {

    callback({ "success": true, "message": "Created Quesiton" })
}


export { createNewCategory, addTextQuestionToCategory, addImageQuestionToCategory, addVideoQuestionToCategoy, addAudioQuestionToCategory }