export default function ThemeToggle({ isDark, toggleTheme }) {
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[var(--background)] border border-[var(--muted)] hover:bg-[var(--foreground)] transition-all duration-300"
            aria-label="Toggle theme"
        >
            {isDark ? '☀️' : '🌙'}
        </button>
    );
}