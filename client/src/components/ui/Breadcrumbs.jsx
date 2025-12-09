import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav className="text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] mb-6 animate-fadeIn">
            <ul className="flex items-center space-x-2">
                <li>
                    <Link to="/" className="hover:text-brand-orange transition-colors">
                        Home
                    </Link>
                </li>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    const label = value.charAt(0).toUpperCase() + value.slice(1);

                    return (
                        <li key={to} className="flex items-center space-x-2">
                            <span>/</span>
                            {isLast ? (
                                <span className="text-brand-orange font-medium">{label}</span>
                            ) : (
                                <Link to={to} className="hover:text-brand-orange transition-colors">
                                    {label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}