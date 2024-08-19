// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {
    $.ajax({
        url: '/api/checkAuth',
        method: 'POST',
        data: JSON.stringify({ uid: sessionStorage.getItem('uid') }),
        contentType: 'application/json',
        success: function (result) {
            if (!result) {
                window.location.href = "./index.html";
            } else {
                loadQuestions();
                bindControlButtons();
            }
        }
    })
});

/**
 * Bind click event listeners to control buttons
 */
function bindControlButtons() {
    document.getElementById('deleteQuestionButton').addEventListener('click', deleteQuestion);
    document.getElementById('previewQuestionButton').addEventListener('click', previewQuestion);
    document.getElementById('addQuestionButton').addEventListener('click', addQuestion);
}

/**
 * Load questions from the server and populate the table
 */
async function loadQuestions() {
    try {
        // Fetch questions from the server
        const response = await fetch('/api/readAllQuestions');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const questions = await response.json();

        // Get the table body element
        const tableBody = document.getElementById('question-table-body');
        tableBody.innerHTML = '';

        // Populate the table with questions
        questions.forEach(question => {
            const row = tableBody.insertRow();
            row.id = question.uuid;
            row.innerHTML = `
                <td>${escapeHtml(question.category)}</td>
                <td>${escapeHtml(question.questionType)}</td>
                <td>${escapeHtml(question.question)}</td>
            `;
        });

        // Bind click event to table rows
        bindRowClickEvent();
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Error loading questions. Please try again later.');
    }
}

/**
 * Bind click event to table rows for selection
 */
function bindRowClickEvent() {
    const tableBody = document.getElementById('question-table-body');
    tableBody.addEventListener('click', function (e) {
        if (e.target.tagName === 'TD') {
            const selectedRow = e.target.parentElement;
            // Remove 'table-warning' class from all rows
            document.querySelectorAll('tr').forEach(row => row.classList.remove('table-warning'));
            // Add 'table-warning' class to the clicked row
            selectedRow.classList.add('table-warning');
        }
    });
}

/**
 * Delete the selected question
 */
async function deleteQuestion() {
    const selectedRow = document.querySelector('tr.table-warning');
    if (!selectedRow) {
        alert('Please select a question to delete.');
        return;
    }

    const category = selectedRow.cells[0].textContent;
    const questionId = selectedRow.id;

    try {
        // Send delete request to the server
        const response = await fetch('/api/deleteQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category, questionId }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
            // Reload questions after successful deletion
            loadQuestions();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error deleting question:', error);
        alert('Error deleting question. Please try again later.');
    }
}

/**
 * Preview or modify the selected question
 */
function previewQuestion() {
    const selectedRow = document.querySelector('tr.table-warning');
    if (!selectedRow) {
        alert('Please select a question to preview or modify.');
        return;
    }

    const questionText = selectedRow.cells[2].textContent;
    alert(`Previewing or Modifying Question: ${questionText}`);
    // TODO: Implement preview or modify functionality
}

/**
 * Navigate to the question creation page
 */
function addQuestion() {
    window.location.href = 'questioncreation.html';
}

/**
 * Escape HTML special characters to prevent XSS attacks
 * @param {string} unsafe - The unsafe string to be escaped
 * @return {string} The escaped safe string
 */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}