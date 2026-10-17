export default function AuthCard({ title, subtitle, children, footer }) {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 animate-fadeIn theme-transition-colors">
            <div className="w-full max-w-md bg-[var(--background)] border border-[var(--muted)] rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-brand-orange mb-2">{title}</h1>
                {subtitle && (
                    <p className="text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] mb-6">{subtitle}</p>
                )}
                {children}
                {footer && (
                    <p className="mt-6 text-center text-sm text-[color-mix(in_oklab,var(--foreground)_70%,transparent)]">
                        {footer}
                    </p>
                )}
            </div>
        </div>
    );
}

export const submitButtonClass =
    'w-full font-bold py-3 rounded-xl transition-all duration-300 shadow-md bg-brand-orange text-brand-black hover:bg-brand-yellow disabled:opacity-50 disabled:cursor-not-allowed';
