document.addEventListener('DOMContentLoaded', () => {
    const closePopUp = document.getElementById('close-pop-up');
    const correctButton = document.getElementById('correct-button');
    const incorrectButton = document.getElementById('incorrect-button');

    function returnToGameplay() {
        window.location.href = 'gameplay.html';
    }

    closePopUp.addEventListener('click', returnToGameplay);

    correctButton.addEventListener('click', () => {
        alert('Correct answer!');
        returnToGameplay();
    });

    incorrectButton.addEventListener('click', () => {
        alert('Incorrect answer.');
        returnToGameplay();
    });
});
