import { invalidateMapSize, initDashboardMap, initFullMap } from './map';

const sidebar = document.querySelector('.sidebar');
const menuToggle = document.getElementById('menuToggle');
const mainContent = document.getElementById('mainContent'); // Get main content area

// --- View Management ---
function showView(viewId) {
    // Hide all views within the main content area
    mainContent.querySelectorAll('[id$="View"]').forEach(view => {
        view.classList.add('hidden');
    });

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
        console.log(`Showing view: ${viewId}`);

        // Initialize or invalidate map size if the view contains a map
        if (viewId === 'dashboardView') {
            console.log("Initializing dashboard map...");
            const mapInstance = initDashboardMap(); // Initialize if not already
            if (mapInstance) {
                console.log("Dashboard map instance obtained, invalidating size...");
                invalidateMapSize(mapInstance); // Invalidate size after showing
            } else {
                console.warn("Dashboard map instance is null after init attempt.");
            }
        } else if (viewId === 'mapView') {
            console.log("Initializing full map...");
            const mapInstance = initFullMap(); // Initialize if not already
            if (mapInstance) {
                console.log("Full map instance obtained, invalidating size...");
                invalidateMapSize(mapInstance); // Invalidate size after showing
            } else {
                console.warn("Full map instance is null after init attempt.");
            }
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
            modal.classList.add('flex'); // Use flex for centering
            console.log("Showing modal:", modalId);
        } else {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            console.log("Hiding modal:", modalId);
        }
    } else {
        console.warn("Modal not found:", modalId);
    }
}

// --- Sidebar Management ---
function closeSidebar() {
    if (sidebar && window.innerWidth < 768) { // Only close on mobile
        sidebar.classList.remove('active');
        sidebar.classList.add('-translate-x-full');
        sidebar.classList.remove('translate-x-0');
        console.log("Sidebar closed");
    }
}

function setupSidebarToggle() {
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            sidebar.classList.toggle('-translate-x-full');
            sidebar.classList.toggle('translate-x-0');
            console.log("Menu toggled");
            // Map size invalidation on toggle is handled in map.js
        });
    } else {
        console.warn("Menu toggle or sidebar not found");
    }
}

// --- Navigation Link Setup ---
function setupNavigationLinks() {
    const navLinks = [
        { id: 'dashboardLink', view: 'dashboardView' },
        { id: 'ticketsLink', view: 'ticketsView' },
        { id: 'shipmentsLink', view: 'shipmentsView' },
        { id: 'mapLink', view: 'mapView' },
        { id: 'viewFullMapLink1', view: 'mapView' } // Link from dashboard map preview
    ];

    navLinks.forEach(linkInfo => {
        const linkElement = document.getElementById(linkInfo.id);
        if (linkElement) {
            linkElement.addEventListener('click', (e) => {
                e.preventDefault();
                showView(linkInfo.view);
                closeSidebar();
            });
        } else {
            console.warn(`Navigation link element not found: ${linkInfo.id}`);
        }
    });
}

// --- Modal Button Setup ---
function setupModalButtons() {
    const modalToggles = [
        // Open buttons
        { buttonId: 'newTicketBtn', modalId: 'newTicketModal', action: 'open' },
        { buttonId: 'newShipmentBtn', modalId: 'newShipmentModal', action: 'open' },
        // Close buttons
        { buttonId: 'closeTicketModal', modalId: 'newTicketModal', action: 'close' },
        { buttonId: 'cancelTicketBtn', modalId: 'newTicketModal', action: 'close' },
        { buttonId: 'closeShipmentModal', modalId: 'newShipmentModal', action: 'close' },
        { buttonId: 'cancelShipmentBtn', modalId: 'newShipmentModal', action: 'close' },
    ];

    modalToggles.forEach(toggle => {
        const button = document.getElementById(toggle.buttonId);
        if (button) {
            button.addEventListener('click', () => {
                toggleModal(toggle.modalId, toggle.action === 'open');
            });
        } else {
             console.warn(`Modal toggle button not found: ${toggle.buttonId}`);
        }
    });
}

export { showView, toggleModal, closeSidebar, setupSidebarToggle, setupNavigationLinks, setupModalButtons };
