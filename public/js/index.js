// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const playButton = document.querySelector('.play-button');
    const manageAccountsBtn = document.getElementById('manage-accounts');
    const manageQuestionsBtn = document.getElementById('manage-questions');
    const manageCategoriesBtn = document.getElementById('manage-categories');

    // Configuration object for page URLs
    const pageUrls = {
        game: './gameConfig.html',
        accounts: './manageAccount.html',
        questions: './manageQuestion.html',
        categories: './manageCategories.html'
    };

    // Function to handle button click animation and navigation
    const handleButtonClick = (button, destination) => {
        button.style.opacity = '0.5';
        setTimeout(() => {
            button.style.opacity = '1';
            window.location.href = destination;
        }, 200);
    };

    // Event listeners for buttons
    playButton.addEventListener('click', () => handleButtonClick(playButton, pageUrls.game));
    manageAccountsBtn.addEventListener('click', () => handleButtonClick(manageAccountsBtn, pageUrls.accounts));
    manageQuestionsBtn.addEventListener('click', () => handleButtonClick(manageQuestionsBtn, pageUrls.questions));
    manageCategoriesBtn.addEventListener('click', () => handleButtonClick(manageCategoriesBtn, pageUrls.categories));

    // Log that the script has loaded successfully
    console.log('Index page script loaded successfully');

    // Commented out code for future authentication implementation
    /*
    // PLAN TO ADD AUTH TO TARGET INCREMENT
    $('#manage-accounts').on('click', function() {
        window.location.href = './authenticationAccount.html';
    });

    $('#manage-questions').on('click', function() {
        window.location.href = './authenticationQuestion.html';
    });

    $('#manage-categories').on('click', function() {
        window.location.href = './authenticationCategories.html';
    });
    */
});
