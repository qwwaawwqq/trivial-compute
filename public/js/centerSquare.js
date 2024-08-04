document.addEventListener('DOMContentLoaded', () => {
    const historyButton = document.getElementById('history-button');
    const artLiteratureButton = document.getElementById('art-literature-button');
    const geographyButton = document.getElementById('geography-button');
    const scienceNatureButton = document.getElementById('science-nature-button');

    function chooseCategory(category) {
        alert(`You chose: ${category}`);
        // Add functionality to handle category choice
        window.location.href = 'gameplay.html'; // Redirect back to gameplay.html
    }

    historyButton.addEventListener('click', () => chooseCategory('History'));
    artLiteratureButton.addEventListener('click', () => chooseCategory('Art & Literature'));
    geographyButton.addEventListener('click', () => chooseCategory('Geography'));
    scienceNatureButton.addEventListener('click', () => chooseCategory('Science & Nature'));
});
