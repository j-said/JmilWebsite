export default function NewsCard({ post, isActive, index, totalCards }) {
    const imageUrl = post.imageUrl || `https://placehold.co/400x300/1a1a1a/FFA500?text=${encodeURIComponent(post.title)}`;

    // Calculate position and styles based on active state
    const getCardStyles = () => {
        if (isActive) {
            return "scale-110 z-20 opacity-100 shadow-2xl bg-[var(--background)] border-brand-orange theme-transition";
        }

        // Cards adjacent to active card
        if (Math.abs(index - (totalCards / 2)) <= 1) {
            return "scale-95 z-10 opacity-80 bg-[color-mix(in_oklab,var(--background)_90%,var(--muted))] border-brand-orange/50 theme-transition";
        }

        // Further cards
        return "scale-75 z-0 opacity-50 bg-[color-mix(in_oklab,var(--background)_80%,var(--muted))] border-brand-orange/30 theme-transition";
    };

    return (
        <article
            className={`
                flex-shrink-0 w-80 rounded-2xl shadow-lg overflow-hidden 
                transition-all duration-500 ease-in-out transform border-2
                hover:scale-105 hover:opacity-100 hover:z-30
                ${getCardStyles()}
            `}
        >
            <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105 theme-transition"
            />
            <div className="p-6 theme-transition">
                <h3 className="text-xl font-bold text-brand-orange mb-3 line-clamp-2 theme-transition">{post.title}</h3>
                <p className="text-[var(--foreground)] text-sm line-clamp-3 leading-relaxed theme-transition">{post.content}</p>
                {isActive && (
                    <button className="mt-4 bg-brand-orange text-brand-black font-semibold py-2 px-4 rounded-lg hover:bg-brand-yellow transition-all duration-300 theme-transition">
                        Read More
                    </button>
                )}
            </div>
        </article>
    );
}