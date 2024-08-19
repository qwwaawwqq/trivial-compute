$(document).ready(function () {
    // Bind event listeners to control buttons
    bindToControlButtons();
});

// Event listeners for buttons
// playButton.addEventListener('click', () => handleButtonClick(playButton, pageUrls.game));
// manageAccountsBtn.addEventListener('click', () => authenticatedNav(manageAccountsBtn, pageUrls.accounts));
// manageQuestionsBtn.addEventListener('click', () => authenticatedNav(manageQuestionsBtn, pageUrls.questions));
// manageCategoriesBtn.addEventListener('click', () => authenticatedNav(manageCategoriesBtn, pageUrls.categories));
// const playButton = document.querySelector('.play-button');
// const manageAccountsBtn = document.getElementById('manage-accounts');
// const manageQuestionsBtn = document.getElementById('manage-questions');
// const manageCategoriesBtn = document.getElementById('manage-categories');


const pageUrls = {
    game: './gameConfig.html',
    accounts: './manageAccount.html',
    questions: './manageQuestion.html',
    categories: './manageCategories.html',
    auth: './authentication.html'
};


function bindToControlButtons() {
    // Bind click event to add play button
    $('#play-button').click(playGame);
    // Bind click event to manage accounts button
    $('#manage-accounts').on('click', manageAccountNav);
    // Bind click event to manage questions button
    $('#manage-questions').on('click', manageQuestionNav);
    // Bind click event to manage categories button
    $('#manage-categories').on('click', managecategoriesNav);
}

// Configuration object for page URLs

// Function to handle button click animation and navigation
function playGame() {
    console.log("yooo")
    // button.style.opacity = '0.5';
    setTimeout(() => {
        // button.style.opacity = '1';
        window.location.href = pageUrls.game;
    }, 200);
};

function manageAccountNav() {
    authenticatedNav(pageUrls.accounts)
}

function manageQuestionNav() {
    authenticatedNav(pageUrls.questions)
}

function managecategoriesNav() {
    authenticatedNav(pageUrls.categories)
}


function authenticatedNav(destination) {
    // button.style.opacity = '0.5';
    $.ajax({
        url: '/api/checkAuth',
        method: 'POST',
        headers: {
            uid: sessionStorage.getItem('uid')
        },
        success: function (result) {
            if (result) {
                setTimeout(() => {
                    window.location.href = destination;
                }, 200);
            } else {
                setTimeout(() => {
                    window.location.href = pageUrls.auth;
                }, 200);
            }



        },
        error: function (xhr, status, error) {
            console.error("Error details:", xhr.responseText);
        }
    });
};


// Log that the script has loaded successfully
console.log('Index page script loaded successfully');

