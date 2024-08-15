// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const closePopUp = document.getElementById('close-pop-up');
    const correctButton = document.getElementById('correct-button');
    const incorrectButton = document.getElementById('incorrect-button');

    // Function to return to the gameplay screen
    function returnToGameplay() {
        window.location.href = 'gameplay.html';
    }

    // Add click event listener to the close button
    closePopUp.addEventListener('click', returnToGameplay);

    // Add click event listener to the correct button
    correctButton.addEventListener('click', () => {
        alert('Correct answer!');
        returnToGameplay();
    });

    // Add click event listener to the incorrect button
    incorrectButton.addEventListener('click', () => {
        alert('Incorrect answer.');
        returnToGameplay();
    });
});