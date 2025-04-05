import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner'; // Assuming you have a spinner component

interface ProtectedRouteProps {
  // Add role-based access control later if needed
  // allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = (/*{ allowedRoles }*/) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Show a loading indicator while checking auth status
    return (
      <div className="flex items-center justify-center h-screen bg-jdc-black">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  if (!currentUser) {
    // User not logged in, redirect to login page (or show AuthModal)
    // For now, we assume AuthModal is shown elsewhere if currentUser is null
    // If using a dedicated login page, redirect: return <Navigate to="/login" replace />;
    return null; // Or potentially show the AuthModal directly here if App structure allows
  }

  // Optional: Role-based access check
  // const userRole = currentUser?.role; // Get role from user profile/token
  // if (allowedRoles && !allowedRoles.includes(userRole)) {
  //   // User role not allowed, redirect to an unauthorized page or dashboard
  //   return <Navigate to="/unauthorized" replace />;
  // }

  // User is authenticated (and optionally authorized), render the child route component
  return <Outlet />;
};

export default ProtectedRoute;
