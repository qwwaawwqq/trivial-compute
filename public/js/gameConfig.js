
$(document).ready(function() {
    // Handle adding players (limited to 4 for simplicity)
    let playerCount = 4;
    localStorage.removeItem('gameSessionID');
    $('#add-player-btn').click(function() {
        if (playerCount < 4) {
            $('#add-player-btn').removeClass("btn-secondary").addClass("btn-primary");
            $('#remove-player-btn').removeClass("btn-secondary").addClass("btn-primary");
            playerCount++;
            $(`#player-${playerCount}-config`).show();

            if (playerCount === 4) {
                $('#add-player-btn').removeClass("btn-primary").addClass("btn-secondary");
            }

        } else {
            alert("Maximum 4 players allowed.");
        }
    });

    // Handle removing players
    $('#remove-player-btn').click(function() {
        if (playerCount > 1) {
            $(`#player-${playerCount}-config`).hide();
            $('#add-player-btn').removeClass("btn-secondary").addClass("btn-primary");
            playerCount--;
            if (playerCount === 1) {
                $('#remove-player-btn').removeClass("btn-primary").addClass("btn-secondary");
            }
        } else {
            alert("At least 1 player is required.");
        }
    });

    $("#game-rule").click(function() {
        let consent = confirm("Read game rules?");
        if (consent) {
            window.location.href = 'gamerules.html'
        }
        else {
            console.log("Game rules not read");
        }
        // Add functionality to return to the previous page
    })


     // Handle starting the game
    $('#start-game-btn').click(function() {
        let players = [];
        let categoryNames = {};
        for (let i = 1; i <= playerCount; i++) {
            let name = $(`#player-${i}-name`).val();
            players.push(name);
        }

        const testColors = ["RED", "YELLOW", "GREEN", "BLUE"]
        for (testColor of testColors) {
            let category = $(`#category-${testColor}-config select`).val();
            
            categoryNames[testColor] = category;      
        }

        console.log('Starting game with players:', players);

        // Store player data in local storage
        localStorage.setItem('players', JSON.stringify(players));

        startGame(categoryNames, players);

    });

    function startGame(categoryNames, players) {

        $.ajax({
            url: '/api/startGame',
            method: 'POST',
            data: JSON.stringify({ categoryNames: categoryNames, playerNames: players}),
            dataType: 'json',
            contentType: 'application/json',
            success: function (response) {
                console.log("start test" + response.gameSessionID);
                localStorage.setItem('gameSessionID', response.gameSessionID);
                localStorage.setItem('gameBoard', JSON.stringify(response.board));
                window.location.href = 'gameplay.html';
            },
            error: function (xhr, status, error) {
                alert("Error Starting Game: " + error);
            }
        })};

    // Initialize by hiding extra player configs
    for (let i = playerCount + 1; i <= 4; i++) {
        $(`#player-${i}-config`).hide();
    }


    $('#return').on('click', function() {
        window.location.href = './index.html';
    });
});
