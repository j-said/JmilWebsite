import { Link } from 'react-router-dom';

const navItems = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/education', label: 'Education' },
    { path: '/about', label: 'About' }
];

export default function DesktopNav() {
    return (
        <div className="space-x-6 hidden md:block">
            {navItems.map((item) => (
                <Link 
                    key={item.path}
                    to={item.path} 
                    className="hover:text-brand-yellow theme-transition-colors duration-200"
                >
                    {item.label}
                </Link>
            ))}
        </div>
    );
}