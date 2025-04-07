import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from './firebase';
import { showView, toggleModal } from './ui'; // Import showView

const loginForm = document.getElementById('loginForm');
const loginEmailInput = document.getElementById('loginEmail');
const loginPasswordInput = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const mainContent = document.getElementById('mainContent');
const loginModal = document.getElementById('loginModal');
const userNameDisplay = document.getElementById('userName');
const userRoleDisplay = document.getElementById('userRole');
const userAvatar = document.getElementById('userAvatar'); // Assuming you have an avatar element

// Function to update UI based on auth state
function updateAuthUI(user) {
    if (user) {
        console.log("User logged in:", user.email);
        // User is signed in
        userNameDisplay.textContent = user.email; // Or user.displayName if available
        userRoleDisplay.textContent = "Technician"; // Replace with actual role if available
        // userAvatar.src = user.photoURL || 'default-avatar.png'; // Set avatar if available

        mainContent.classList.remove('hidden'); // Show main content
        loginModal.classList.add('hidden'); // Hide login modal
        loginModal.classList.remove('flex');
        logoutBtn.classList.remove('hidden'); // Show logout button

        // Explicitly show the dashboard view *after* main content is visible
        showView('dashboardView');

        // Clear login form and error
        if (loginForm) loginForm.reset();
        if (loginError) loginError.classList.add('hidden');

    } else {
        console.log("User logged out or not logged in.");
        // User is signed out
        userNameDisplay.textContent = "Not Logged In";
        userRoleDisplay.textContent = "";
        // userAvatar.src = 'default-avatar.png'; // Reset avatar

        mainContent.classList.add('hidden'); // Hide main content
        loginModal.classList.remove('hidden'); // Show login modal
        loginModal.classList.add('flex');
        logoutBtn.classList.add('hidden'); // Hide logout button
    }
}

// --- Authentication Event Listener ---
onAuthStateChanged(auth, (user) => {
    updateAuthUI(user);
});

// --- Login Form Handling ---
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        loginError.classList.add('hidden'); // Hide error initially

        try {
            console.log("Attempting login for:", email);
            await signInWithEmailAndPassword(auth, email, password);
            // Auth state change will trigger updateAuthUI
            console.log("Login successful via form submission for:", email);
        } catch (error) {
            console.error("Login failed:", error.message);
            loginError.textContent = `Login Failed: ${error.message}`; // Display specific error
            loginError.classList.remove('hidden');
        }
    });
} else {
    console.warn("Login form not found.");
}


// --- Logout Button Handling ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            // Auth state change will trigger updateAuthUI
            console.log("Logout successful.");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    });
} else {
    console.warn("Logout button not found.");
}

export { updateAuthUI }; // Export if needed elsewhere, though listener handles it
