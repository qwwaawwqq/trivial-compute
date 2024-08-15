$(document).ready(function() {
    // Example: Add new account
    $('.btn-success').click(function() {
        let username = $('#new-username').val();
        let password = $('#new-password').val();
        let accessLevel = $('input[name="accessLevel"]:checked').val();
        console.log('New Account:', username, password, accessLevel);
        // Add functionality to create new account
    });

    // Example: Change selected account password
    $('.btn-info').click(function() {
        let newPassword = $('#change-password').val();
        console.log('Change Password:', newPassword);
        // Add functionality to change password
    });

    // Example: Change selected account access level
    $('input[name="changeAccessLevel"]').change(function() {
        let newAccessLevel = $('input[name="changeAccessLevel"]:checked').val();
        console.log('Change Access Level:', newAccessLevel);
        // Add functionality to change access level
    });
});
