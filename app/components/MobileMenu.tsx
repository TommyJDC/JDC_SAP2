import React from 'react';
import { NavLink } from '@remix-run/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTachometerAlt, faTicketAlt, faTruck, faUsers, faSignInAlt, faSignOutAlt, faUserCog, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import type { User } from 'firebase/auth';
import type { UserData } from '~/types/user';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  userData: UserData | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, user, userData, onLoginClick, onLogoutClick }) => {
  if (!isOpen) return null;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive
        ? 'bg-jdc-yellow text-jdc-black'
        : 'text-jdc-gray-300 hover:bg-jdc-gray-700 hover:text-white'
    }`;

  const handleLogin = () => {
    onLoginClick();
    onClose(); // Close menu after initiating login
  };

  const handleLogout = () => {
    onLogoutClick();
    onClose(); // Close menu after initiating logout
  };

  const isAdmin = userData?.role === 'Admin';
  const isPending = userData?.role === 'Pending';
  // Condition to show main navigation links (User has a role, and it's not 'Pending')
  const isApprovedUser = userData?.role && !isPending;

  return (
    <div
      className="md:hidden fixed inset-0 z-50"
      id="mobile-menu"
      aria-modal="true"
      role="dialog"
    >
      <div className="fixed inset-0 bg-black bg-opacity-60" aria-hidden="true" onClick={onClose}></div>

      <div className="fixed top-0 left-0 h-full w-64 bg-jdc-card shadow-xl p-4 transform transition-transform ease-in-out duration-300 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-semibold text-white">Menu</span>
          <button
            onClick={onClose}
            className="text-jdc-gray-400 hover:text-white"
            aria-label="Fermer le menu"
          >
            <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
          </button>
        </div>

        <nav className="space-y-2 flex-grow">
          {/* Common Links */}
          <NavLink to="/dashboard" className={navLinkClass} onClick={onClose}>
            <FontAwesomeIcon icon={faTachometerAlt} className="mr-3 h-5 w-5" />
            Tableau de Bord
          </NavLink>

          {/* Conditional Links */}
          {isApprovedUser && ( // Use the condition here
            <>
              {/* --- VERIFY THIS LINK --- */}
              <NavLink to="/tickets-sap" className={navLinkClass} onClick={onClose}>
                <FontAwesomeIcon icon={faTicketAlt} className="mr-3 h-5 w-5" />
                Tickets SAP
              </NavLink>
              <NavLink to="/envois-ctn" className={navLinkClass} onClick={onClose}>
                <FontAwesomeIcon icon={faTruck} className="mr-3 h-5 w-5" />
                Envois CTN
              </NavLink>
              <NavLink to="/clients" className={navLinkClass} onClick={onClose}>
                <FontAwesomeIcon icon={faUsers} className="mr-3 h-5 w-5" />
                Clients
              </NavLink>
            </>
          )}

          {/* Admin Only Link */}
          {isAdmin && (
            <NavLink to="/admin/users" className={navLinkClass} onClick={onClose}>
              <FontAwesomeIcon icon={faUserCog} className="mr-3 h-5 w-5" />
              Gestion Utilisateurs
            </NavLink>
          )}

          {/* Pending User Message */}
          {isPending && (
             <div className="px-3 py-2 mt-4 text-sm text-yellow-400 bg-yellow-900 bg-opacity-30 rounded-md flex items-center">
                <FontAwesomeIcon icon={faHourglassHalf} className="mr-2" />
                <span>Votre compte est en attente de validation.</span>
             </div>
          )}
        </nav>

        <hr className="my-4 border-jdc-gray-600" />

        <div className="space-y-2">
          {user ? (
            <>
              <div className="px-3 py-2 text-jdc-gray-300 text-sm">
                Connecté en tant que <br />
                <span className="font-medium text-white block truncate">{user.email}</span>
                <span className="text-xs text-jdc-gray-400">({userData?.role || 'Chargement...'})</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-jdc-gray-300 hover:bg-jdc-gray-700 hover:text-white"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 h-5 w-5" />
                Déconnexion
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-jdc-gray-300 hover:bg-jdc-gray-700 hover:text-white"
            >
              <FontAwesomeIcon icon={faSignInAlt} className="mr-3 h-5 w-5" />
              Connexion / Inscription
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
