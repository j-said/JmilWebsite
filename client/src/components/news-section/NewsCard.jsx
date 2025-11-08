import { Link } from 'react-router-dom';

export default function NewsCard({ post, isActive }) {
    const imageUrl = post.imageUrl || `https://placehold.co/400x300/1a1a1a/FFA500?text=${encodeURIComponent(post.title)}`;

    return (
        <article
            className={`
                w-80 rounded-2xl shadow-lg overflow-hidden border-2
                transition-all duration-500 ease-in-out
                ${isActive
                    ? 'border-brand-orange bg-[var(--background)] shadow-2xl'
                    : 'border-brand-orange/30 bg-[color-mix(in_oklab,var(--background)_90%,var(--muted))] shadow-lg'
                }
                hover:shadow-xl hover:border-brand-orange/60
            `}
        >
            <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="p-6">
                <h3 className="text-xl font-bold text-brand-orange mb-3 line-clamp-2 theme-transition">
                    {post.title}
                </h3>
                <p className="text-[var(--foreground)] text-sm line-clamp-3 leading-relaxed theme-transition">
                    {post.content}
                </p>
                {isActive && (
                    <Link
                        to={`/news/${post.id}`}
                        className="inline-block mt-4 bg-brand-orange text-brand-black font-semibold py-2 px-4 rounded-lg hover:bg-brand-yellow transition-all duration-300 theme-transition"
                    >
                        Read More
                    </Link>
                )}
            </div>
        </article>
    );
}