import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentAdminRole, hasAccess } from '../../utils/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPath: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPath }) => {
  const location = useLocation();
  const adminRole = getCurrentAdminRole();

  if (!adminRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAccess(adminRole, requiredPath)) {
    // Redirect to dashboard if user doesn't have access
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;


