$(document).ready(function () {
    bindControlButtons();
    loadCategories()
    $("#question-type-options").empty()
});


function bindControlButtons() {
    // $('#previewQuestionButton').on('click', previewQuestion);
    $('#question-type-dropdown').on('change', updateQuestionsPerType)
}

function loadCategories() {
    $.ajax({
        url: '/api/readAllCategories',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log("Server response:", response);  // Log the entire response
            let categories = response;

            // Check if the response is wrapped in a data property
            if (response.data && Array.isArray(response.data)) {
                categories = response.data;
            }

            if (Array.isArray(categories)) {
                $('#question-category-dropdown').empty();
                $('#question-category-dropdown').append(`<option value="" disabled selected>Select Category</option>`);
                categories.forEach(function (category) {
                    $('#question-category-dropdown').append(`<option>${category}</option>`);
                });
            } else {
                console.error("Invalid data format received:", categories);
                alert("Error: Invalid data format received from server.");
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", status, error);
            console.error("Response Text:", xhr.responseText);
            if (xhr.status === 0) {
                alert("Unable to connect to the server. Please ensure the server is running and try again.");
            } else {
                alert("Error loading categories. Please check the console for more details.");
            }
        },
        timeout: 5000  // Set a timeout of 5 seconds
    });
}

function updateQuestionsPerType() {
    $("#question-type-options").empty()
    $("#question-type-dropdown").val()
    const type = $("#question-type-dropdown").val()
    if (type == "Multiple Choice") {
        $("#question-type-options").append(`
            <small class="form-text text-muted">
                Question
            </small>
            <input id="mc-question" type="text" class="form-control d-inline-block" id="rename-category"
            placeholder="Question">
            <small class="form-text text-muted">
                Choice 1
            </small>
            <input id="mc-choice-1" type="text" class="form-control d-inline-block" id="rename-category"
            placeholder="Choice 1">
            <small class="form-text text-muted">
                Choice 2
            </small>
            <input id="mc-choice-2" type="text" class="form-control d-inline-block" id="rename-category"
            placeholder="Choice 2">
             <small class="form-text text-muted">
                Choice 3
            </small>
            <input id="mc-choice-3" type="text" class="form-control d-inline-block" id="rename-category"
            placeholder="Choice 3">
             <small class="form-text text-muted">
                Choice 4
            </small>
            <input id="mc-choice-4" type="text" class="form-control d-inline-block"  id="rename-category"
            placeholder="Choice 4">
            <small class="form-text text-muted">
                Answer
            </small>
            <input id="mc-answer" type="text" class="form-control d-inline-block" id="rename-category"
            placeholder="Answer">
            <button class="btn btn-primary" onclick="addMultipleChoiceQuestion()">Add Multiple Choice Question</button>
        `)

    } else if (type == "Open Ended") {
        $("#question-type-options").append(`
            <small class="form-text text-muted">
                Question
            </small>
            <input id="oe-question" type="text" class="form-control d-inline-block" id="rename-category"
            placeholder="Question">
           <small class="form-text text-muted">
                Answer
            </small>
             <input id="oe-answer" type="text" class="form-control d-inline-block" id="rename-category"
            placeholder="Answer">
            <button class="btn btn-primary" onclick="addOpenEndedQuestion()">Add Multiple Choice Question</button>
            `
        )
    } else if (type == "Video") {
        $("#question-type-options").append(`
            <small class="form-text text-muted">
                Question
            </small>
            <input id="v-question" type="text" class="form-control d-inline-block" id="rename-category"
            placeholder="Question">
            <small class="form-text text-muted">
                Answer
            </small>
             <input id="oe-answer" type="text" class="form-control d-inline-block" id="rename-category"
            placeholder="Answer">
            <input id="video-file" type="file" id="myFile" name="filename">
            <button class="btn btn-primary" onclick="addMediaQuestion()">Add ${type} Question</button>
            `
        )
    }
}

function addMultipleChoiceQuestion() {
    let categoryName = $('#question-category-dropdown').val();
    let difficultyLevel = $('#question-difficulty-dropdown').val();
    let creator = $('#mc-answer').val();
    let answer = $('#creator').val();
    let question = $('#mc-question').val();

    let choice = []
    choice.push($('#mc-choice-1').val())
    choice.push($('#mc-choice-2').val())
    choice.push($('#mc-choice-3').val())
    choice.push($('#mc-choice-4').val())
    $.ajax({
        url: '/api/addTextMultipleChoiceQuestionToCategory',
        method: 'PUT',
        data: JSON.stringify({ categoryName: categoryName, difficultyLevel: difficultyLevel, creator: creator, answer: answer, question: question, choices: choice }),
        contentType: 'application/json',
        success: function (result) {
            alert("Question Created")
        },
        error: function (xhr, status, error) {
            console.error("Error details:", xhr.responseText);
            alert("Error adding category: " + xhr.responseText);
        }
    });
}

function addOpenEndedQuestion() {
    let categoryName = $('#question-category-dropdown').val();
    let difficultyLevel = $('#question-difficulty-dropdown').val();
    let answer = $('#oe-answer').val();
    let creator = $('#creator').val();
    let question = $('#oe-question').val();
    $.ajax({
        url: '/api/addTextOpenEndedQuestionToCategory',
        method: 'PUT',
        data: JSON.stringify({ categoryName: categoryName, difficultyLevel: difficultyLevel, creator: creator, answer: answer, question: question }),
        contentType: 'application/json',
        success: function (result) {
            alert("Question Created")
        },
        error: function (xhr, status, error) {
            console.error("Error details:", xhr.responseText);
            alert("Error adding category: " + xhr.responseText);
        }
    });
}

function addMediaQuestion() {
    let type = $("#question-type-dropdown").val()
    let categoryName = $('#question-category-dropdown').val();
    let difficultyLevel = $('#question-difficulty-dropdown').val();
    let answer = $('#v-answer').val();
    let creator = $('#creator').val();
    let question = $('#v-question').val();
    let fileInput = $('#video-file')[0];
    let file = fileInput.files[0];
    // //categoryName, difficultyLevel, creator, answer, question, type, file

    const formData = new FormData();
    formData.append('file', file); // Append the file to the form data
    formData.append('categoryName', categoryName);
    formData.append('difficultyLevel', difficultyLevel);
    formData.append('answer', answer);
    formData.append('creator', creator);
    formData.append('question', question);
    formData.append('type', type);


    $.ajax({
        url: '/api/addMediaQuestionToCategory',
        method: 'PUT',
        type: 'PUT',
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
            alert("Question Created")
        },
        error: function (xhr, status, error) {
            console.error("Error details:", xhr.responseText);
            alert("Error adding category: " + xhr.responseText);
        }
    });
}


function exitPreview() {
    window.location.href = 'manageQuestion.html'; // Adjust the path if necessary
}




function addImage() {
    alert("Adding an image.");
    // Implement the functionality to add an image
}

function addAudio() {
    alert("Adding audio.");
    // Implement the functionality to add audio
}

function addVideo() {
    alert("Adding a video.");
    // Implement the functionality to add a video
}
