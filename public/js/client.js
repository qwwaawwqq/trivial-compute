// Fetch Firebase config from server
fetch('/firebase-config')
    .then(response => response.json())
    .then(firebaseConfig => {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();

        // DOM elements
        const authSection = document.getElementById('auth-section');
        const userSection = document.getElementById('user-section');
        const registerForm = document.getElementById('register-form');
        const loginForm = document.getElementById('login-form');
        const logoutButton = document.getElementById('logout-button');
        const userDisplayName = document.getElementById('user-displayName');
        const userList = document.getElementById('user-list');
        const homeBtn = document.getElementById('homeBtn');


        // Login form submit
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
                        console.log('Login successful:', data);
                        console.log('Redirecting to manageAccount.html');
                        window.location.href = '/manageAccount.html';
                    } else {
                        alert('Login failed: ' + (data.error || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error('Error handling login response:', error);
                });
        });


        // Logout button click
        logoutButton.addEventListener('click', () => {
            fetch('/signOut', { method: 'POST' })
                .then(response => {
                    if (response.status === 200) {
                        console.log('Logout successful');
                        auth.signOut(); // This will trigger the onAuthStateChanged listener
                    } else {
                        throw new Error('Logout failed');
                    }
                })
                .catch(error => console.error('Error:', error));
        });

        // Home button click
        homeBtn.addEventListener('click', () => {
            console.log('Home button clicked'); // For debugging
            window.location.href = '/index.html'; // Make sure this path is correct
        });

        // Auth state change listener
        auth.onAuthStateChanged(user => {
            if (user) {
                authSection.classList.add('hidden');
                userSection.classList.remove('hidden');
                userDisplayName.textContent = user.displayName || user.email;
                fetchUsers();
            } else {
                authSection.classList.remove('hidden');
                userSection.classList.add('hidden');
            }
        });

        // Fetch users function
        function fetchUsers() {
            auth.currentUser.getIdToken(true)
                .then(idToken => {
                    return fetch('/api/users', {
                        headers: { 'Authorization': idToken }
                    });
                })
                .then(response => response.json())
                .then(users => {
                    userList.innerHTML = '';
                    for (const [id, user] of Object.entries(users)) {
                        const li = document.createElement('li');
                        li.textContent = `${user.name} (${user.email})`;
                        userList.appendChild(li);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    })
    .catch(error => console.error('Error loading Firebase config:', error));
