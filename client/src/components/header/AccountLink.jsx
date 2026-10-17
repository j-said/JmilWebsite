import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AccountLink({ className = '', onClick }) {
    const { user, isAuthenticated } = useAuth();
    return (
        <Link
            to={isAuthenticated ? '/profile' : '/login'}
            onClick={onClick}
            className={`hover:text-brand-orange theme-transition-colors duration-200 ${className}`}
        >
            {isAuthenticated ? user.firstName : 'Sign in'}
        </Link>
    );
}
