import L from 'leaflet';

let dashboardMapInstance = null;
let fullMapInstance = null;

// Function to invalidate map size when its container becomes visible or resizes
function invalidateMapSize(mapInstance) {
    if (mapInstance) {
        // Using 100ms delay based on previous attempt, seems reasonable
        setTimeout(() => {
            try {
                mapInstance.invalidateSize();
                console.log(`Invalidated map size for: ${mapInstance.getContainer().id}`);
            } catch (e) {
                console.warn(`Could not invalidate map size for ${mapInstance.getContainer().id}:`, e);
            }
        }, 100); // Keep 100ms delay for now
    } else {
        console.warn("Attempted to invalidate size on null map instance.");
    }
}

function initDashboardMap() {
    const mapElement = document.getElementById('dashboardMap');
    if (mapElement && !dashboardMapInstance) {
        console.log("Attempting to initialize dashboard map (ID: dashboardMap)..."); // Added log
        try {
            dashboardMapInstance = L.map(mapElement).setView([51.505, -0.09], 5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(dashboardMapInstance);

            // Add sample markers (replace with dynamic data later)
            L.marker([51.5, -0.09]).addTo(dashboardMapInstance).bindPopup('ABC Corporation');
            L.marker([51.51, -0.1]).addTo(dashboardMapInstance).bindPopup('XYZ Industries');

            console.log("Dashboard map initialized successfully.");
            // No need to call invalidateMapSize here, it's called after init in showView
        } catch (error) {
            console.error("Dashboard map initialization error:", error);
            dashboardMapInstance = null; // Ensure instance is null on error
        }
    } else if (dashboardMapInstance) {
        console.log("Dashboard map already initialized.");
    } else if (!mapElement) {
        console.warn("Dashboard map element (ID: dashboardMap) not found in DOM.");
    }
    return dashboardMapInstance;
}

function initFullMap() {
    const mapElement = document.getElementById('fullMap');
    if (mapElement && !fullMapInstance) {
        console.log("Attempting to initialize full map (ID: fullMap)..."); // Added log
        try {
            fullMapInstance = L.map(mapElement).setView([51.505, -0.09], 5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(fullMapInstance);

            // Define icons
            const clientIcon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
            });
            const shipmentIcon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
            });

            // Add sample markers
            L.marker([51.5, -0.09], { icon: clientIcon }).addTo(fullMapInstance).bindPopup('ABC Corporation');
            L.marker([51.51, -0.1], { icon: clientIcon }).addTo(fullMapInstance).bindPopup('XYZ Industries');
            L.marker([51.49, -0.08], { icon: shipmentIcon }).addTo(fullMapInstance).bindPopup('CTN-2023-00567<br>In Transit');
            L.marker([51.52, -0.11], { icon: shipmentIcon }).addTo(fullMapInstance).bindPopup('CTN-2023-00568<br>In Transit');

            console.log("Full map initialized successfully.");
            // No need to call invalidateMapSize here, it's called after init in showView
        } catch (error) {
            console.error("Full map initialization error:", error);
            fullMapInstance = null; // Ensure instance is null on error
        }
    } else if (fullMapInstance) {
        console.log("Full map already initialized.");
    } else if (!mapElement) {
        console.warn("Full map element (ID: fullMap) not found in DOM.");
    }
    return fullMapInstance;
}

// Initialize maps when needed (e.g., when view becomes visible)
// This function might not be strictly necessary anymore as init is tied to showView
function initializeMapsIfNeeded() {
    if (document.getElementById('dashboardMap')?.offsetParent !== null && !dashboardMapInstance) {
        console.log("Initializing dashboard map via initializeMapsIfNeeded...");
        initDashboardMap();
        invalidateMapSize(dashboardMapInstance); // Invalidate after init if called here
    }
    if (document.getElementById('fullMap')?.offsetParent !== null && !fullMapInstance) {
        console.log("Initializing full map via initializeMapsIfNeeded...");
        initFullMap();
        invalidateMapSize(fullMapInstance); // Invalidate after init if called here
    }
}

// Call invalidateSize on window resize
window.addEventListener('resize', () => {
    console.log("Window resized, invalidating map sizes...");
    invalidateMapSize(dashboardMapInstance);
    invalidateMapSize(fullMapInstance);
});

// Also invalidate size when sidebar toggles on mobile
const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        // Delay after the sidebar transition might finish
        console.log("Sidebar toggled, invalidating map sizes after delay...");
        setTimeout(() => {
            invalidateMapSize(dashboardMapInstance);
            invalidateMapSize(fullMapInstance);
        }, 350); // Corresponds to sidebar transition duration + buffer
    });
}


export { initDashboardMap, initFullMap, invalidateMapSize, initializeMapsIfNeeded }; // Keep initializeMapsIfNeeded export for now
