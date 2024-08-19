const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            console.log('Received response from /login');
            return response.json();
        })
        .then(data => {
            console.log('Parsed JSON:', data);
            if (data.success) {
                console.log(data)
                console.log('Login successful:', data);
                console.log('Redirecting to manageAccount.html');
                console.log(data.userId)
                sessionStorage.setItem('uid', data.userId)
                window.location.href = '/index.html';
            } else {
                alert('Login failed: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error handling login response:', error);
        });



    // // Logout button click
    // logoutButton.addEventListener('click', () => {
    //     fetch('/signOut', { method: 'POST' })
    //         .then(response => {
    //             if (response.status === 200) {
    //                 console.log('Logout successful');
    //                 auth.signOut(); // This will trigger the onAuthStateChanged listener
    //             } else {
    //                 throw new Error('Logout failed');
    //             }
    //         })
    //         .catch(error => console.error('Error:', error));
});
