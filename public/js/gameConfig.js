$(document).ready(function() {
    // Handle adding players (limited to 4 for simplicity)
    let playerCount = 4;
    $('#add-player-btn').click(function() {
        if (playerCount < 4) {
            playerCount++;
            $(`#player-${playerCount}-config`).show();
        } else {
            alert("Maximum 4 players allowed.");
        }
    });

    // Handle removing players
    $('#remove-player-btn').click(function() {
        if (playerCount > 1) {
            $(`#player-${playerCount}-config`).hide();
            playerCount--;
        } else {
            alert("At least 1 player is required.");
        }
    });

     // Handle starting the game
    $('#start-game-btn').click(function() {
        let players = [];
        for (let i = 1; i <= playerCount; i++) {
            let name = $(`#player-${i}-name`).val();
            let category = $(`#player-${i}-config select`).val();
            players.push({ name: name, category: category });
        }
        console.log('Starting game with players:', players);

        // Store player data in local storage
        localStorage.setItem('players', JSON.stringify(players));

        // Redirect to gameplay.html
        window.location.href = 'gameplay.html';
    });

    // Initialize by hiding extra player configs
    for (let i = playerCount + 1; i <= 4; i++) {
        $(`#player-${i}-config`).hide();
    }
});
