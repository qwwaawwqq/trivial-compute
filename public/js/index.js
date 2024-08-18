$(document).ready(function () {
    bindToControlButtons();
});

function bindToControlButtons() {
    $('#play-button').on('click', playGame);
    $('#manage-accounts').on('click', manageAccounts);
    $('#manage-questions').on('click', manageQuestions);
    $('#manage-categories').on('click', manageCategories);
    // $('#rename-category-btn').on('click', renameCategory);
    // $('.btn-danger').on('click', deleteCategory);
}

function playGame() {
    $(this).fadeOut(150).fadeIn(150, function () {
        window.location.href = './gameConfig.html';
    });
}

function manageAccounts() {
    $.ajax({
        url: '/api/checkAuth',
        method: 'POST',
        headers: {
            uid: sessionStorage.getItem('uid')
        },
        success: function (result) {
            if (result.isLogedIn) {
                window.location.href = './manageAccount.html';
            }
            else {
                // Promt Login in 
                alert("Not Logged in")
            }
        },
        error: function (xhr, status, error) {
            console.error("Error details:", xhr.responseText);
            alert("Error adding category: " + xhr.responseText);
        }
    });

}

function manageQuestions() {
    window.location.href = './manageQuestion.html';
}

function manageCategories() {
    window.location.href = './manageCategories.html';
}



// $.ajax({
//     url: '/login',
//     type: 'POST',
//     data: { email: email, password: password },
//     statusCode: {
//         200: function (userID) {
//             sessionStorage.setItem('uid', userID)
//             window.location.href = '/beatmaker.html'
//         },
//         203: function (result) {
//             display_alert(result.replace('Firebase: ', ''), 'danger')
//         }
//     }
// })



// PLAN TO ADD AUTH TO TARGET INCREMENT
// $('#manage-accounts').on('click', function() {
//     window.location.href = './authenticationAccount.html';
// });

// $('#manage-questions').on('click', function() {
//     window.location.href = './authenticationQuestion.html';
// });

// $('#manage-categories').on('click', function() {
//     window.location.href = './authenticationCategories.html';
// });

// });
