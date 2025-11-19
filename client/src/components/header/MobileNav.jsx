import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const navItems = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/education', label: 'Education' },
    { path: '/about', label: 'About' }
];

export default function MobileNav({ isOpen, onClose, isDark, toggleTheme }) {
    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-400 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-[var(--background)] theme-transition-colors shadow-2xl z-50 transform transition-transform duration-400 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Close button */}
                <div className="flex justify-end p-4 border-b border-[var(--muted)]">
                    <button
                        onClick={onClose}
                        className="p-2 text-[var(--foreground)] hover:text-brand-orange theme-transition-colors duration-300"
                        aria-label="Close menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="p-6">
                    <div className="space-y-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="block text-xl font-semibold text-[var(--foreground)] hover:text-brand-orange theme-transition-colors duration-200 py-3 border-b border-[var(--muted)]"
                                onClick={onClose}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Theme toggle */}
                    <div className="mt-8 pt-6 border-[var(--muted)]">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-[var(--foreground)]">Theme</span>
                            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}