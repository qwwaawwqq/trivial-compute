// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {
    // $.ajax({
    //     url: '/api/checkAuth',
    //     method: 'POST',
    //     data: JSON.stringify({ uid: sessionStorage.getItem('uid') }),
    //     contentType: 'application/json',
    //     success: function (result) {
    //         if (!result) {
    //             window.location.href = "./index.html";
    //         }
    //         else {
    //             loadAccounts()
    //         }
    //     }
    // })
    loadAccounts()
    $("#createNewAccount").on('click', createNewAccount);
    $("#deleteUser").on('click', deleteAccount);
    // Initialize the page
    // initializeAccountManager();
});



function loadAccounts() {
    $.ajax({
        url: '/api/listTeachers',
        method: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log("Server response:", response);  // Log the entire response
            let teachers = response;

            // Check if the response is wrapped in a data property
            if (response.data && Array.isArray(response.data)) {
                teachers = response.data;
            }

            if (Array.isArray(teachers)) {
                $('table tbody').empty();
                teachers.forEach(function (teacher) {
                    $('table tbody').append(`<tr><td id=${teacher.uid}>${teacher.email}</td></tr>`);
                });
                bindRowClickEvent();
            } else {
                console.error("Invalid data format received:", teachers);
                alert("Error: Invalid data format received from server.");
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", status, error);
            console.error("Response Text:", xhr.responseText);
            if (xhr.status === 0) {
                alert("Unable to connect to the server. Please ensure the server is running and try again.");
            } else {
                alert("Error loading teachers. Please check the console for more details.");
            }
        },
        timeout: 5000  // Set a timeout of 5 seconds
    });
}

function bindRowClickEvent() {
    $(document).off('click', 'table tbody tr').on('click', 'table tbody tr', function () {
        $('table tbody tr').removeClass('table-warning');
        $(this).addClass('table-warning');
        let selectedCategory = $(this).find('td:first').attr('id');
        console.log('Selected category:', selectedCategory);
    });
}

function deleteAccount() {
    // Get the selected row and category name
    let selectedRow = $('tr.table-warning');
    let uid = selectedRow.find('td').attr('id');
    console.log(uid)
    if (selectedRow.length) {
        // Send a DELETE request to the server to delete the category
        $.ajax({
            url: '/api/deleteUser',
            method: 'POST',
            data: JSON.stringify({ uid: uid }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {
                if (result.success) {
                    loadAccounts()
                } else {
                    alert("Error deleting user: " + result.error);
                }
            },
            error: function (xhr, status, error) {
                alert("Error deleting category: " + error);
            }
        });
    } else {
        alert("Please select a category to delete.");
    }
}

function createNewAccount() {
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;
    fetch('/api/createNewAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            console.log('Received response from /login');
            console.log(response)
            return response.json();
        })
        .then(data => {
            console.log('Parsed JSON:', data);
            if (data.success) {
                loadAccounts()
            } else {
                alert('Login failed: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error handling login response:', error);
        });
}



// /**
//  * Initialize the account manager functionality
//  */
// function initializeAccountManager() {
//     // Bind event listeners to buttons
//     bindDeleteAccountButton();
//     bindAddAccountButton();
//     bindChangePasswordButton();
//     bindChangeAccessLevelButton();

//     // Add row selection functionality
//     addRowSelectionHandler();
// }

// /**
//  * Bind click event to the Delete Selected Account button
//  */
// function bindDeleteAccountButton() {
//     const deleteButton = document.querySelector('.btn-danger');
//     deleteButton.addEventListener('click', deleteSelectedAccount);
// }

// /**
//  * Delete the selected account
//  */
// function deleteSelectedAccount() {
//     const selectedRow = document.querySelector('tr.table-warning');
//     if (selectedRow) {
//         // TODO: Implement account deletion logic
//         console.log('Deleting account:', selectedRow.cells[0].textContent);
//         selectedRow.remove();
//     } else {
//         alert('Please select an account to delete.');
//     }
// }

// /**
//  * Bind click event to the Add Account button
//  */
// function bindAddAccountButton() {
//     const addButton = document.querySelector('.btn-success');
//     addButton.addEventListener('click', addNewAccount);
// }

// /**
//  * Add a new account
//  */
// function addNewAccount() {
//     const username = document.getElementById('new-username').value;
//     const password = document.getElementById('new-password').value;
//     const accessLevel = document.querySelector('input[name="accessLevel"]:checked').value;

//     // TODO: Implement account creation logic
//     console.log('Adding new account:', { username, accessLevel });

//     // Clear form fields after submission
//     document.getElementById('new-username').value = '';
//     document.getElementById('new-password').value = '';
// }

// /**
//  * Bind click event to the Change Password button
//  */
// function bindChangePasswordButton() {
//     const changePasswordButton = document.querySelector('.btn-info');
//     changePasswordButton.addEventListener('click', changeSelectedAccountPassword);
// }

// /**
//  * Change the password for the selected account
//  */
// function changeSelectedAccountPassword() {
//     const selectedRow = document.querySelector('tr.table-warning');
//     const newPassword = document.getElementById('change-password').value;

//     if (selectedRow && newPassword) {
//         // TODO: Implement password change logic
//         console.log('Changing password for:', selectedRow.cells[0].textContent);
//         document.getElementById('change-password').value = '';
//     } else {
//         alert('Please select an account and enter a new password.');
//     }
// }

// /**
//  * Bind click event to the Change Access Level button
//  */
// function bindChangeAccessLevelButton() {
//     const changeAccessLevelButton = document.querySelectorAll('.btn-info')[1];
//     changeAccessLevelButton.addEventListener('click', changeSelectedAccountAccessLevel);
// }

// /**
//  * Change the access level for the selected account
//  */
// function changeSelectedAccountAccessLevel() {
//     const selectedRow = document.querySelector('tr.table-warning');
//     const newAccessLevel = document.querySelector('input[name="changeAccessLevel"]:checked').value;

//     if (selectedRow) {
//         // TODO: Implement access level change logic
//         console.log('Changing access level for:', selectedRow.cells[0].textContent, 'to', newAccessLevel);
//         selectedRow.cells[1].textContent = newAccessLevel;
//     } else {
//         alert('Please select an account to change the access level.');
//     }
// }

// /**
//  * Add click event handler for row selection
//  */
// function addRowSelectionHandler() {
//     const tableBody = document.querySelector('tbody');
//     tableBody.addEventListener('click', function (e) {
//         if (e.target.tagName === 'TD') {
//             const clickedRow = e.target.parentElement;
//             document.querySelectorAll('tr').forEach(row => row.classList.remove('table-warning'));
//             clickedRow.classList.add('table-warning');
//         }
//     });
// }