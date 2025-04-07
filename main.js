import './style.css'; // Import Tailwind CSS
import L from 'leaflet'; // Import Leaflet
// Import Firebase - NOTE: You'll need to install these via npm if you haven't
// import firebase from 'firebase/app'; // Use 'firebase/compat/app' for v9 compat
// import 'firebase/auth'; // Use 'firebase/compat/auth'
// import 'firebase/firestore'; // Use 'firebase/compat/firestore'

// --- Firebase Configuration ---
// IMPORTANT: Replace with your actual Firebase config
// It's recommended to use environment variables for sensitive keys
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (Check Firebase v9+ modular syntax if needed)
// try {
//   if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }
// } catch (error) {
//   console.error("Firebase initialization error:", error);
// }
// const auth = firebase.auth();
// const db = firebase.firestore();
console.log("Firebase config loaded (replace with actual initialization)");


// --- Map Initialization ---
let dashboardMapInstance = null;
let fullMapInstance = null;

function initMaps() {
    try {
        // Dashboard map
        if (document.getElementById('dashboardMap') && !dashboardMapInstance) {
            dashboardMapInstance = L.map('dashboardMap').setView([51.505, -0.09], 5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(dashboardMapInstance);

            // Add sample markers
            L.marker([51.5, -0.09]).addTo(dashboardMapInstance)
                .bindPopup('ABC Corporation')
                .openPopup();

            L.marker([51.51, -0.1]).addTo(dashboardMapInstance)
                .bindPopup('XYZ Industries');
             console.log("Dashboard map initialized");
        }

        // Full map
        if (document.getElementById('fullMap') && !fullMapInstance) {
            fullMapInstance = L.map('fullMap').setView([51.505, -0.09], 5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(fullMapInstance);

            // Add sample markers with different icons
            const clientIcon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', // Default Leaflet icon
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            // Example: Customizing shipment icon color via CSS might be better
            const shipmentIcon = L.icon({
                 iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', // Default Leaflet icon
                 shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                 iconSize: [25, 41],
                 iconAnchor: [12, 41],
                 popupAnchor: [1, -34],
                 shadowSize: [41, 41],
                 // className: 'shipment-marker-icon' // Add a class to style with CSS
            });


            L.marker([51.5, -0.09], {icon: clientIcon}).addTo(fullMapInstance)
                .bindPopup('ABC Corporation')
                .openPopup();

            L.marker([51.51, -0.1], {icon: clientIcon}).addTo(fullMapInstance)
                .bindPopup('XYZ Industries');

            L.marker([51.49, -0.08], {icon: shipmentIcon}).addTo(fullMapInstance)
                .bindPopup('CTN-2023-00567<br>In Transit');

            L.marker([51.52, -0.11], {icon: shipmentIcon}).addTo(fullMapInstance)
                .bindPopup('CTN-2023-00568<br>In Transit');
            console.log("Full map initialized");
        }
    } catch (error) {
        console.error("Map initialization error:", error);
    }
}

// Function to invalidate map size when its container becomes visible
function invalidateMapSize(mapInstance) {
    if (mapInstance) {
        setTimeout(() => {
            mapInstance.invalidateSize();
            console.log("Invalidated map size for:", mapInstance);
        }, 10); // Small delay ensures container is rendered
    }
}

// --- View Management ---
function showView(viewId) {
    document.querySelectorAll('[id$="View"]').forEach(view => {
        view.classList.add('hidden');
    });
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
        console.log("Showing view:", viewId);

        // Invalidate map size if the view contains a map
        if (viewId === 'dashboardView') {
            invalidateMapSize(dashboardMapInstance);
        } else if (viewId === 'mapView') {
            invalidateMapSize(fullMapInstance);
        }
    } else {
        console.warn("View not found:", viewId);
    }
}

// --- Modal Management ---
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (modal) {
        if (show) {
            modal.classList.remove('hidden');
            console.log("Showing modal:", modalId);
        } else {
            modal.classList.add('hidden');
            console.log("Hiding modal:", modalId);
        }
    } else {
        console.warn("Modal not found:", modalId);
    }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded");

    // Initialize maps
    initMaps();

    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const dashboardLink = document.getElementById('dashboardLink');
    const ticketsLink = document.getElementById('ticketsLink');
    const shipmentsLink = document.getElementById('shipmentsLink');
    const mapLink = document.getElementById('mapLink');
    const viewFullMapLink1 = document.getElementById('viewFullMapLink1'); // Link from dashboard map preview
    const newTicketBtn = document.getElementById('newTicketBtn');
    const closeTicketModal = document.getElementById('closeTicketModal');
    const cancelTicketBtn = document.getElementById('cancelTicketBtn');
    const newShipmentBtn = document.getElementById('newShipmentBtn');
    const closeShipmentModal = document.getElementById('closeShipmentModal');
    const cancelShipmentBtn = document.getElementById('cancelShipmentBtn');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const userNameDisplay = document.getElementById('userName');
    const userRoleDisplay = document.getElementById('userRole');

    // Menu toggle for mobile
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            // Toggle translate class for visibility
            sidebar.classList.toggle('-translate-x-full');
            sidebar.classList.toggle('translate-x-0');
            console.log("Menu toggled");
        });
    } else {
        console.warn("Menu toggle or sidebar not found");
    }

    // Function to close sidebar (used by nav links)
    const closeSidebar = () => {
        if (sidebar && window.innerWidth < 768) { // Only close on mobile
             sidebar.classList.remove('active');
             sidebar.classList.add('-translate-x-full');
             sidebar.classList.remove('translate-x-0');
             console.log("Sidebar closed");
        }
    };

    // Navigation links
    if (dashboardLink) {
        dashboardLink.addEventListener('click', (e) => {
            e.preventDefault();
            showView('dashboardView');
            closeSidebar();
        });
    }
     if (ticketsLink) {
        ticketsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showView('ticketsView');
            closeSidebar();
        });
    }
    if (shipmentsLink) {
        shipmentsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showView('shipmentsView');
            closeSidebar();
        });
    }
    if (mapLink) {
        mapLink.addEventListener('click', (e) => {
            e.preventDefault();
            showView('mapView');
            closeSidebar();
        });
    }
    if (viewFullMapLink1) {
         viewFullMapLink1.addEventListener('click', (e) => {
            e.preventDefault();
            showView('mapView'); // Navigate to the full map view
            closeSidebar();
        });
    }


    // Ticket modal
    if (newTicketBtn) {
        newTicketBtn.addEventListener('click', () => toggleModal('newTicketModal', true));
    }
    if (closeTicketModal) {
        closeTicketModal.addEventListener('click', () => toggleModal('newTicketModal', false));
    }
    if (cancelTicketBtn) {
        cancelTicketBtn.addEventListener('click', () => toggleModal('newTicketModal', false));
    }

    // Shipment modal
    if (newShipmentBtn) {
        newShipmentBtn.addEventListener('click', () => toggleModal('newShipmentModal', true));
    }
    if (closeShipmentModal) {
        closeShipmentModal.addEventListener('click', () => toggleModal('newShipmentModal', false));
    }
    if (cancelShipmentBtn) {
        cancelShipmentBtn.addEventListener('click', () => toggleModal('newShipmentModal', false));
    }

    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginEmailInput ? loginEmailInput.value : null;
            const password = loginPasswordInput ? loginPasswordInput.value : null;

            console.log("Login attempt with:", email); // Avoid logging password

            // Simulate login (in a real app, use Firebase Auth)
            // Example: auth.signInWithEmailAndPassword(email, password).then(...)
            if (email && password) { // Basic check
                toggleModal('loginModal', false);
                // Set user info (replace with actual data from auth)
                if (userNameDisplay) userNameDisplay.textContent = 'John Doe';
                if (userRoleDisplay) userRoleDisplay.textContent = 'Technician';
                console.log("Simulated login successful");
                // Show dashboard by default after login
                showView('dashboardView');
            } else {
                console.log("Simulated login failed: Email or password missing");
                // Add error handling feedback to the user
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log("Logout clicked");
            // Simulate logout (in a real app, use Firebase Auth)
            // Example: auth.signOut().then(...)
            toggleModal('loginModal', true); // Show login modal
            showView('dashboardView'); // Optionally reset to dashboard view behind modal
            closeSidebar();
             // Clear user info
             if (userNameDisplay) userNameDisplay.textContent = 'Logged Out';
             if (userRoleDisplay) userRoleDisplay.textContent = '';
             console.log("Simulated logout complete");
        });
    }

    // Initial setup: Show login modal by default if not logged in
    // This logic would typically check auth state
    const isLoggedIn = false; // Simulate logged out state initially
    if (!isLoggedIn) {
        toggleModal('loginModal', true);
    } else {
         toggleModal('loginModal', false);
         showView('dashboardView'); // Show dashboard if already logged in
    }

     // Ensure maps are invalidated if their containers resize (optional but good practice)
     window.addEventListener('resize', () => {
        invalidateMapSize(dashboardMapInstance);
        invalidateMapSize(fullMapInstance);
     });

});
