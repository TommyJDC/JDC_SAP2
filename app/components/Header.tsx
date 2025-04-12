import React from 'react';
import { Link, NavLink } from '@remix-run/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUserCircle, faSignOutAlt, faSignInAlt, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { Button } from './ui/Button';
import type { User } from 'firebase/auth';
import type { UserData } from '~/types/user';

interface HeaderProps {
  user: User | null;
  userData: UserData | null;
  onToggleMobileMenu: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, userData, onToggleMobileMenu, onLoginClick, onLogoutClick }) => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-jdc-yellow text-jdc-black'
        : 'text-jdc-gray-300 hover:bg-jdc-gray-700 hover:text-white'
    }`;

  const isAdmin = userData?.role === 'Admin';
  // Condition to show main navigation links (User has a role, and it's not 'Pending')
  const showMainLinks = userData?.role && userData.role !== 'Pending';

  return (
    <header className="bg-jdc-card shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
             <Link to="/" className="flex-shrink-0">
               <img
                 className="h-8 w-auto"
                 src="https://www.jdc.fr/images/logo_jdc_blanc.svg"
                 alt="JDC Logo"
               />
             </Link>
            <button
              onClick={onToggleMobileMenu}
              className="ml-4 md:hidden inline-flex items-center justify-center p-2 rounded-md text-jdc-gray-400 hover:text-white hover:bg-jdc-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Common Links */}
            <NavLink to="/dashboard" className={navLinkClass}>
              Tableau de Bord
            </NavLink>
            {/* Conditional Links based on role */}
            {showMainLinks && ( // Use the condition here
              <>
                {/* --- VERIFY THIS LINK --- */}
                <NavLink to="/tickets-sap" className={navLinkClass}>
                  Tickets SAP
                </NavLink>
                <NavLink to="/envois-ctn" className={navLinkClass}>
                  Envois CTN
                </NavLink>
                <NavLink to="/clients" className={navLinkClass}>
                  Clients
                </NavLink>
              </>
            )}
             {/* Admin Only Link */}
             {isAdmin && (
                <NavLink to="/admin/users" className={navLinkClass}>
                    <FontAwesomeIcon icon={faUserCog} className="mr-1" /> Gestion Utilisateurs
                </NavLink>
             )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-jdc-gray-300 text-sm flex items-center" title={userData?.role || 'Rôle non défini'}>
                  <FontAwesomeIcon icon={faUserCircle} className="mr-2 h-5 w-5" />
                  {user.email || 'Utilisateur'}
                  {userData?.role === 'Pending' && <span className="ml-2 text-xs text-yellow-400">(En attente)</span>}
                </span>
                <Button onClick={onLogoutClick} variant="secondary" size="sm">
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-1 h-4 w-4" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button onClick={onLoginClick} variant="primary" size="sm">
                 <FontAwesomeIcon icon={faSignInAlt} className="mr-1 h-4 w-4" />
                Connexion
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
