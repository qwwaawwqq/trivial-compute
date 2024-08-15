$(document).ready(function () {
    $('.play-button').on('click', function () {
        $(this).fadeOut(150).fadeIn(150, function () {
            window.location.href = './gameConfig.html';
        });
    });

    $('#manage-accounts').on('click', function () {
        window.location.href = './manageAccount.html';
    });

    $('#manage-questions').on('click', function () {
        window.location.href = './manageQuestion.html';
    });

    $('#manage-categories').on('click', function () {
        window.location.href = './manageCategories.html';
    });




    // PLAN TO ADD AUTH TO TARGET INCREMENT
    // $('#manage-accounts').on('click', function() {
    //     window.location.href = './authenticationAccount.html';
    // });

    // $('#manage-questions').on('click', function() {
    //     window.location.href = './authenticationQuestion.html';
    // });

    // $('#manage-categories').on('click', function() {
    //     window.location.href = './authenticationCategories.html';
    // });

});
