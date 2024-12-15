import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && !user.isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
}; 