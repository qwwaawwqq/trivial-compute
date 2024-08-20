document.addEventListener('DOMContentLoaded', function() {
    $("#return-button").click(function() {
        let consent = confirm("Return to Home?");
        if (consent) {
            window.location.href = 'gameConfig.html'
        }
        else {
            console.log("Somebody tried to quit");
        }
        // Add functionality to return to the previous page
    })

});