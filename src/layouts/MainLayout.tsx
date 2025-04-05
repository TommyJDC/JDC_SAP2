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
    default: return 'JDC Internal'; // Default or fallback title
  }
};

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  return (
    <div className="flex h-screen bg-jdc-black">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={pageTitle} />
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-jdc-black p-6 md:ml-64">
          {/* Outlet renders the matched child route component */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
