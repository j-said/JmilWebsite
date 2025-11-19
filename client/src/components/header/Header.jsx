import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import ThemeToggle from './ThemeToggle';
import BurgerButton from './BurgerButton';
import CartBadge from '../market/cart/CartBadge';
import Logo from './Logo';

export default function Header() {
    const [isDark, setIsDark] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme) {
            setIsDark(savedTheme === 'dark');
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else {
            setIsDark(prefersDark);
            document.documentElement.classList.toggle('dark', prefersDark);
        }
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        document.documentElement.classList.toggle('dark', newIsDark);
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Only show cart badge on market page
    const showCartBadge = location.pathname === '/shop';

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