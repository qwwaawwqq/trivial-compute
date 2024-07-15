$(document).ready(function() {
    $('.play-button').on('click', function() {
        window.location.href = './gameConfig.html';
    });

    $('#manage-accounts').on('click', function() {
        window.location.href = './authentication.html';
    });

    $('#manage-questions').on('click', function() {
        window.location.href = './manageQuestion.html';
    });
     $('#manage-categories').on('click', function() {
        window.location.href = './manageCategories.html';
    });
});