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

        // Register form submit
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const displayName = document.getElementById('register-displayName').value;

            fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, displayName })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Registration successful. Please log in.');
                }
            })
            .catch(error => console.error('Error:', error));
        });

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
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    return auth.signInWithCustomToken(data.token);
                }
            })
            .then(() => {
                console.log('User signed in');
            })
            .catch(error => console.error('Error:', error));
        });

        // Logout button click
        logoutButton.addEventListener('click', () => {
            auth.signOut();
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