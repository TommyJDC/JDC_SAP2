import '../style.css'; // Import Tailwind CSS base styles
import { auth } from './firebase'; // Import initialized auth
import { updateAuthUI } from './auth'; // Import auth UI updater (listeners are in auth.js)
import { initializeMapsIfNeeded } from './map'; // Import map initializer
import { setupSidebarToggle, setupNavigationLinks, setupModalButtons, showView } from './ui'; // Import UI setup functions

// --- Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded - Initializing App");

    // Setup UI elements and interactions
    setupSidebarToggle();
    setupNavigationLinks();
    setupModalButtons();

    // Initialize maps if their containers are visible initially
    // (though typically they won't be until login)
    initializeMapsIfNeeded();

    // Authentication state is handled by the listener in auth.js
    // which calls updateAuthUI and shows/hides content appropriately.
    // We might show a loading indicator here initially.

    console.log("App Initialized");
});
