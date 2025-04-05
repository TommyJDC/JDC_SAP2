import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

// Helper function to get page title from path
const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/': return 'Tableau de bord';
    case '/tickets': return 'Gestion des Tickets SAP';
    case '/shipments': return 'Suivi des Envois CTN';
    case '/users': return 'Gestion des Utilisateurs';
    case '/settings': return 'Paramètres';
    // Add more cases for nested routes if needed
    default:
      // Handle potential nested routes like /tickets/TKT-123
      if (pathname.startsWith('/tickets/')) return 'Détail Ticket SAP';
      if (pathname.startsWith('/shipments/')) return 'Détail Envoi CTN';
      return 'JDC Internal'; // Default or fallback title
  }
};

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768); // Keep sidebar open on desktop by default
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Handle window resize to show/hide sidebar appropriately
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Don't automatically open on resize if user manually closed it on desktop
        // setSidebarOpen(true);
      } else {
        setSidebarOpen(false); // Keep closed on mobile unless toggled
      }
    };
    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="flex h-screen bg-jdc-black"> {/* Ensure base background is set */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {/* Content Area Wrapper */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <Header pageTitle={pageTitle} />
        {/* Main Content Area */}
        {/* Removed overflow-hidden from parent, ensure main scrolls */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* Outlet renders the matched child route component */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
