export default function ThemeToggle({ isDark, toggleTheme }) {
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-brand-black hover:bg-brand-yellow transition-colors duration-200 shadow-lg"
            aria-label="Toggle theme"
        >
            {isDark ? '☀️' : '🌙'}
        </button>
    );
}