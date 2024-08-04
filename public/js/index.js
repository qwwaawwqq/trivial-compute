$(document).ready(function() {
    $('.play-button').on('click', function() {
        window.location.href = './gameConfig.html';
    });

    $('#manage-accounts').on('click', function() {
        window.location.href = './authenticationAccount.html';
    });

    $('#manage-questions').on('click', function() {
        window.location.href = './authenticationQuestion.html';
    });

    $('#manage-categories').on('click', function() {
        window.location.href = './authenticationCategories.html';
    });
});
