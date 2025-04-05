import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  Truck,
  Users,
  Settings,
  LogOut,
  X,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { logout, currentUser } = useAuth();
  const location = useLocation();
  // const isAdmin = currentUser?.role === 'admin'; // Replace with actual role check later
  const isAdmin = true; // Placeholder

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const userDisplayName = currentUser?.displayName || currentUser?.email || 'Utilisateur';
  const userRole = "Administrateur"; // Placeholder - fetch actual role later

  const navItems = [
    { name: 'Tableau de bord', path: '/', icon: LayoutDashboard },
    { name: 'Tickets SAP', path: '/tickets', icon: Ticket },
    { name: 'Envois CTN', path: '/shipments', icon: Truck },
  ];

  const adminNavItems = [
    { name: 'Utilisateurs', path: '/users', icon: Users },
    { name: 'Paramètres', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Menu Button - Keep semi-transparent */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-40 bg-black/50 backdrop-blur-sm p-2 rounded text-white hover:bg-white/20 transition"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile - Keep semi-transparent */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar - Reverted to solid dark background with subtle right border */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 z-30 transform ${ // Changed background
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col border-r border-white/10`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 flex-shrink-0">
          <img
            src="https://www.jdc.fr/images/logo_jdc_blanc.svg"
            alt="JDC Logo"
            className="h-8"
          />
        </div>

        {/* User Info - Adjusted background */}
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center p-2 bg-gray-800 rounded"> {/* Changed background */}
            {/* Avatar background slightly lighter */}
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3 text-white font-medium">
              {getInitials(userDisplayName)}
            </div>
            <div>
              <div className="font-medium text-white text-sm truncate">{userDisplayName}</div>
              <div className="text-xs text-gray-400">{userRole}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 overflow-y-auto">
          <div className="mb-4">
            <div className="text-xs uppercase text-gray-500 px-2 mb-2">Navigation</div>
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                // Keep transparent hover/active states
                className={({ isActive: active }) =>
                  `flex items-center px-3 py-2 rounded transition text-gray-300 hover:bg-white/10 hover:text-white ${
                    active ? 'bg-jdc-yellow/20 text-jdc-yellow font-medium' : ''
                  }`
                }
                onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}
              >
                <item.icon size={20} className="mr-3" />
                {item.name}
              </NavLink>
            ))}
          </div>

          {isAdmin && (
            <div className="mb-2">
              <div className="text-xs uppercase text-gray-500 px-2 mb-2">Administration</div>
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  // Keep transparent hover/active states
                  className={({ isActive: active }) =>
                    `flex items-center px-3 py-2 rounded transition text-gray-300 hover:bg-white/10 hover:text-white ${
                      active ? 'bg-jdc-yellow/20 text-jdc-yellow font-medium' : ''
                    }`
                  }
                  onClick={() => { if (window.innerWidth < 768) toggleSidebar(); }}
                >
                  <item.icon size={20} className="mr-3" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          )}
        </nav>

        {/* Logout Button - Keep transparent hover */}
        <div className="p-4 flex-shrink-0">
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 rounded hover:bg-white/10 transition text-gray-300 hover:text-white"
          >
            <LogOut size={20} className="mr-3" />
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
