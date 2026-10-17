export default function Alert({ children }) {
    if (!children) return null;
    return (
        <div role="alert" className="mb-6 p-4 bg-red-500/10 border border-red-400 text-red-500 rounded-xl flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{children}</span>
        </div>
    );
}
