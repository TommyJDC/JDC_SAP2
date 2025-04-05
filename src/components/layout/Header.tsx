import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC<{ pageTitle: string }> = ({ pageTitle }) => {
  const { currentUser, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const userDisplayName = currentUser?.displayName || currentUser?.email || 'Utilisateur';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  // Placeholder notifications
  const notifications = [
    { id: 1, type: 'urgent', title: 'Ticket urgent #TKT-2023-001', details: 'Assigné à vous par Admin', time: 'Il y a 5 minutes', icon: AlertTriangle, iconBg: 'bg-yellow-500' },
    { id: 2, type: 'update', title: 'Envoi CTN #SHP-2023-045', details: 'Statut mis à jour: Livré', time: 'Il y a 2 heures', icon: CheckCircle, iconBg: 'bg-blue-500' },
    // Add more notifications
  ];

  return (
    // Reverted to solid dark background with a subtle bottom border
    <header className="bg-gray-900 border-b border-white/10 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Page Title (visible on larger screens) */}
        <h1 className="text-xl font-bold text-white hidden md:block">{pageTitle}</h1>

        {/* Spacer to push icons to the right */}
        <div className="flex-grow md:hidden"></div>

        <div className="flex items-center space-x-4">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              // Hover uses subtle transparency
              className="p-2 rounded-full hover:bg-white/10 relative text-gray-300 hover:text-white transition"
              aria-label="Notifications"
            >
              <Bell size={22} />
              {/* Notification indicator - Border matches header background */}
              {notifications.length > 0 && (
                 <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-jdc-yellow border-2 border-gray-900"></span>
              )}
            </button>
            {notificationsOpen && (
              // Dropdown uses a slightly lighter solid dark background
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-gray-800 rounded-md shadow-lg z-20 border border-white/10">
                <div className="p-3 border-b border-white/10">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-white">Notifications</h3>
                    <button className="text-xs text-jdc-yellow hover:underline">Tout marquer comme lu</button>
                  </div>
                </div>
                <div className="divide-y divide-white/10 max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? notifications.map(notif => (
                    <a key={notif.id} href="#" className="flex items-start p-3 hover:bg-white/10 transition duration-150 ease-in-out">
                      <div className={`${notif.iconBg} rounded-full p-1 mr-3 flex-shrink-0 mt-1`}>
                        <notif.icon size={16} className="text-black" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{notif.title}</p>
                        <p className="text-xs text-gray-400">{notif.details}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    </a>
                  )) : (
                    <p className="text-sm text-gray-400 p-4 text-center">Aucune nouvelle notification</p>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-2 text-center border-t border-white/10">
                    <a href="#" className="text-sm text-jdc-yellow hover:underline">Voir toutes les notifications</a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              // Hover uses subtle transparency
              className="flex items-center space-x-2 hover:bg-white/10 p-1 rounded-md transition"
              aria-label="User Menu"
            >
              {/* Avatar background slightly lighter */}
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-medium text-sm">
                {getInitials(userDisplayName)}
              </div>
              <span className="text-white text-sm hidden sm:inline">{userDisplayName}</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            {userMenuOpen && (
              // Dropdown uses a slightly lighter solid dark background
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-20 border border-white/10 py-1">
                <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition">Mon profil</a>
                <a href="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition">Paramètres</a>
                <div className="border-t border-white/10 my-1"></div>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
