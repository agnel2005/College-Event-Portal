import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect to home or logic for unauthorized role
        // Assuming 'staff' role has its own dashboard, and 'student' has home
        return <Navigate to={user.role === 'staff' ? '/staff-dashboard' : '/home'} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
