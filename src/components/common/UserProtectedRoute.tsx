import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

interface UserProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Centralized route guard for authenticated user pages.
 * Redirects to /login if user is not authenticated.
 * Preserves the intended destination in location state for redirect after login.
 */
const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default UserProtectedRoute;
