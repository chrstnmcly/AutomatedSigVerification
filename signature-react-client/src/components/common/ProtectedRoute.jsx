import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../api/authService';

const ProtectedRoute = ({ allowedRoles }) => {
    const user = authService.getCurrentUser();

    if (!user?.token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};


export default ProtectedRoute;
