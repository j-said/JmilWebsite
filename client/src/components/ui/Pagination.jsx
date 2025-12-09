export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    // Helper to handle clicks safely
    const handleClick = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex justify-center flex-wrap gap-2 mb-8 animate-fadeIn">
            {/* Previous Button */}
            <button
                onClick={() => handleClick(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--background)] border border-[var(--muted)] disabled:opacity-50 hover:border-brand-orange transition-colors text-[var(--foreground)] disabled:cursor-not-allowed cursor-pointer"
                aria-label="Previous Page"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                    key={pageNum}
                    onClick={() => handleClick(pageNum)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all cursor-pointer ${currentPage === pageNum
                            ? 'bg-brand-orange text-brand-black scale-110 shadow-md'
                            : 'bg-[var(--background)] border border-[var(--muted)] hover:border-brand-orange text-[var(--foreground)]'
                        }`}
                >
                    {pageNum}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => handleClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--background)] border border-[var(--muted)] disabled:opacity-50 hover:border-brand-orange transition-colors text-[var(--foreground)] disabled:cursor-not-allowed cursor-pointer"
                aria-label="Next Page"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}