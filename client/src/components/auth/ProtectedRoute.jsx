import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Spinner() {
    return (
        <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
        </div>
    );
}

/** Renders nested routes for signed-in users; sends everyone else to /login and back. */
export default function ProtectedRoute() {
    const { isAuthenticated, isResolving } = useAuth();
    const location = useLocation();

    if (isResolving) return <Spinner />;
    if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
    return <Outlet />;
}
