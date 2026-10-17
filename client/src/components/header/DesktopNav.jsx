import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '../../constants/navItems';


export default function DesktopNav() {
    return (
        <div className="space-x-6 hidden md:block">
            {NAV_ITEMS.map((item) => (
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