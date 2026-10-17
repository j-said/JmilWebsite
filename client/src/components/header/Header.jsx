import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import ThemeToggle from './ThemeToggle';
import BurgerButton from './BurgerButton';
import CartBadge from '../market/cart/CartBadge';
import Logo from '../ui/Logo';
import AccountLink from './AccountLink';

export default function Header() {
    // The initial theme class is set by an inline script in index.html (before first paint).
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        document.documentElement.classList.toggle('dark', newIsDark);
        try {
            localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
        } catch {
            // Theme just won't persist.
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Only show cart badge on market page
    const showCartBadge = location.pathname === '/shop' || location.pathname.startsWith('/shop/');

    return (
        <>
            <header className="bg-[var(--background)]  p-4 sticky top-0 z-50 shadow-lg border-b border-[var(--muted)] theme-transition-colors">
                <nav className="container mx-auto flex justify-between items-center">

                    <Link to="/" className="text-brand-black flex items-center space-x-2 group  dark:text-brand-yellow theme-transition-colors duration-300">
                        <Logo className="w-8 h-8" />
                        <span className="text-2xl font-bold">
                            JmilDrones
                        </span>
                    </Link>
                    
                    <DesktopNav />

                    <div className="flex items-center space-x-4">
                        {/* Show CartBadge only on market page */}
                        {showCartBadge && <CartBadge />}
                        <AccountLink className="hidden md:inline font-medium" />

                        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
                        <BurgerButton
                            isOpen={isMobileMenuOpen}
                            toggleMenu={toggleMobileMenu}
                        />
                    </div>
                </nav>
            </header>

            <MobileNav
                isOpen={isMobileMenuOpen}
                onClose={closeMobileMenu}
                isDark={isDark}
                toggleTheme={toggleTheme}
            />
        </>
    );
}