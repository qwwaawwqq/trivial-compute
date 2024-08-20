document.addEventListener('DOMContentLoaded', function() {
    // Fetch Firebase config from server
    fetch('/firebase-config')
        .then(response => response.json())
        .then(firebaseConfig => {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            const auth = firebase.auth();

            // DOM elements
            const authSection = document.getElementById('auth-section');
            const loginForm = document.getElementById('login-form');
            const homeBtn = document.getElementById('homeBtn');
            const errorMessage = document.getElementById('error-message');

            // Check if all elements exist
            if (!authSection || !loginForm || !homeBtn || !errorMessage) {
                console.error('One or more DOM elements are missing');
                return;
            }

            // Sign out the user to ensure they need to log in every time they enter the page
            auth.signOut().then(() => {
                console.log('User signed out on page load');
            }).catch(error => {
                console.error('Error signing out user:', error);
            });

            // Login form submit
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;

                auth.signInWithEmailAndPassword(email, password)
                    .then(userCredential => {
                        window.location.href = '/manageQuestion.html'; // Redirect to manageAccount.html on successful login
                    })
                    .catch(error => {
                        console.error('Login failed:', error);
                        errorMessage.textContent = 'Invalid email or password. Please try again.';
                        errorMessage.classList.remove('hidden');
                    });
            });

            // Home button click
            homeBtn.addEventListener('click', () => {
                window.location.href = '/index.html';
            });
        })
        .catch(error => console.error('Error loading Firebase config:', error));
});
