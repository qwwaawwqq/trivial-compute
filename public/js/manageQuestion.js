$(document).ready(function () {
    loadQuestions();
    bindControlButtons();
});

function bindControlButtons() {
    $('#deleteQuestionButton').on('click', deleteQuestion);
    $('#previewQuestionButton').on('click', previewQuestion);
    $('#addQuestionButton').on('click', addQuestion);
}

function loadQuestions() {
    $.ajax({
        url: '/api/readAllQuestions',
        method: 'GET',
        dataType: 'json',
        success: function (result) {
            let questions = result;
            console.log(questions)
            $('#question-table-body').empty();
            questions.forEach(function (question) {
                $('#question-table-body').append(`<tr id=${question.uuid}><td>${question.category}</td><td>${question.questionType}</td><td>${question.question}</td></tr>`);
            });
            bindRowClickEvent();
        },
        error: function (xhr, status, error) {
            alert("Error loading questions: " + error);
        }
    });
}

function bindRowClickEvent() {
    $(document).off('click', 'table tbody tr').on('click', 'table tbody tr', function () {
        $('table tbody tr').removeClass('table-warning');
        $(this).addClass('table-warning');
    });
}

function deleteQuestion() {
    let selectedRow = $('tr.table-warning');
    if (selectedRow.length) {
        let category = selectedRow.find('td:first').text();
        let questionId = selectedRow.attr('id');
        console.log(category, questionId)

        $.ajax({
            url: '/api/deleteQuestion',
            method: 'POST',
            data: JSON.stringify({ category: category, questionId: questionId }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {
                if (result.success) {
                    loadQuestions();
                } else {
                    alert("Error deleting question: " + result.error);
                }
            },
            error: function (xhr, status, error) {
                alert("Error deleting question: " + error);
            }
        });
    } else {
        alert("Please select a question to delete.");
    }
}

function previewQuestion() {
    let selectedRow = $('tr.table-warning');
    if (selectedRow.length) {
        let questionText = selectedRow.find('td:last').text();
        alert("Previewing or Modifying Question: " + questionText);
        // Implement preview or modify functionality here
    } else {
        alert("Please select a question to preview or modify.");
    }
}

function addQuestion() {
    window.location.href = 'questioncreation.html'; // Adjust the path if necessary

    // Implement add new question functionality here
}
