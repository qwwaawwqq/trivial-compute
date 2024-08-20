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
            }
        }
    })
    // Initialize the page
    initializeAccountManager();
});

/**
 * Initialize the account manager functionality
 */
function initializeAccountManager() {
    // Bind event listeners to buttons
    bindDeleteAccountButton();
    bindAddAccountButton();
    bindChangePasswordButton();
    bindChangeAccessLevelButton();

    // Add row selection functionality
    addRowSelectionHandler();
}

/**
 * Bind click event to the Delete Selected Account button
 */
function bindDeleteAccountButton() {
    const deleteButton = document.querySelector('.btn-danger');
    deleteButton.addEventListener('click', deleteSelectedAccount);
}

/**
 * Delete the selected account
 */
function deleteSelectedAccount() {
    const selectedRow = document.querySelector('tr.table-warning');
    if (selectedRow) {
        // TODO: Implement account deletion logic
        console.log('Deleting account:', selectedRow.cells[0].textContent);
        selectedRow.remove();
    } else {
        alert('Please select an account to delete.');
    }
}

/**
 * Bind click event to the Add Account button
 */
function bindAddAccountButton() {
    const addButton = document.querySelector('.btn-success');
    addButton.addEventListener('click', addNewAccount);
}

/**
 * Add a new account
 */
function addNewAccount() {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const accessLevel = document.querySelector('input[name="accessLevel"]:checked').value;

    // TODO: Implement account creation logic
    console.log('Adding new account:', { username, accessLevel });

    // Clear form fields after submission
    document.getElementById('new-username').value = '';
    document.getElementById('new-password').value = '';
}

/**
 * Bind click event to the Change Password button
 */
function bindChangePasswordButton() {
    const changePasswordButton = document.querySelector('.btn-info');
    changePasswordButton.addEventListener('click', changeSelectedAccountPassword);
}

/**
 * Change the password for the selected account
 */
function changeSelectedAccountPassword() {
    const selectedRow = document.querySelector('tr.table-warning');
    const newPassword = document.getElementById('change-password').value;

    if (selectedRow && newPassword) {
        // TODO: Implement password change logic
        console.log('Changing password for:', selectedRow.cells[0].textContent);
        document.getElementById('change-password').value = '';
    } else {
        alert('Please select an account and enter a new password.');
    }
}

/**
 * Bind click event to the Change Access Level button
 */
function bindChangeAccessLevelButton() {
    const changeAccessLevelButton = document.querySelectorAll('.btn-info')[1];
    changeAccessLevelButton.addEventListener('click', changeSelectedAccountAccessLevel);
}

/**
 * Change the access level for the selected account
 */
function changeSelectedAccountAccessLevel() {
    const selectedRow = document.querySelector('tr.table-warning');
    const newAccessLevel = document.querySelector('input[name="changeAccessLevel"]:checked').value;

    if (selectedRow) {
        // TODO: Implement access level change logic
        console.log('Changing access level for:', selectedRow.cells[0].textContent, 'to', newAccessLevel);
        selectedRow.cells[1].textContent = newAccessLevel;
    } else {
        alert('Please select an account to change the access level.');
    }
}

/**
 * Add click event handler for row selection
 */
function addRowSelectionHandler() {
    const tableBody = document.querySelector('tbody');
    tableBody.addEventListener('click', function (e) {
        if (e.target.tagName === 'TD') {
            const clickedRow = e.target.parentElement;
            document.querySelectorAll('tr').forEach(row => row.classList.remove('table-warning'));
            clickedRow.classList.add('table-warning');
        }
    });
}