import { useState, useEffect } from 'react';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import ThemeToggle from './ThemeToggle';
import BurgerButton from './BurgerButton';

export default function Header() {
    const [isDark, setIsDark] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    return (
        <>
            <header className="bg-[var(--background)] text-[var(--foreground)] p-4 sticky top-0 z-50 shadow-lg border-b border-[var(--muted)] theme-transition">
                <nav className="container mx-auto flex justify-between items-center">
                    <a href="/" className="text-2xl font-bold text-brand-orange">JmilDrones</a>

                    <DesktopNav />

                    <div className="flex items-center space-x-4">
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