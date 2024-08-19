// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {
    $.ajax({
        url: '/api/checkAuth',
        method: 'POST',
        headers: {
            uid: sessionStorage.getItem('uid')
        },
        success: function (result) {
            if (!result) {
                window.location.href = "./index.html";
            }
            else {
                initializeAccountManager();
            }
        }
    })
    // Initialize the page

});