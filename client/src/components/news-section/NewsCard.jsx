import { Link } from 'react-router-dom';

export default function NewsCard({ post, isActive, className = "" }) {
    const imageUrl = post.imageUrl || `https://placehold.co/600x400/1a1a1a/FFA500?text=${encodeURIComponent(post.title)}`;

    const formattedDate = post.created_at
        ? new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : '';

    return (
        <article
            className={`
                rounded-2xl shadow-lg overflow-hidden border-2 flex flex-col h-full bg-[var(--background)]
                transition-all duration-500 ease-in-out
                ${isActive
                    ? 'border-brand-orange shadow-2xl scale-100'
                    : 'border-[var(--muted)] shadow-lg scale-95 opacity-70'
                }
                hover:shadow-xl hover:border-brand-orange/60
                ${className}
            `}
        >
            <div className="relative h-48 sm:h-56 overflow-hidden flex-shrink-0">
                <img
                    src={imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {formattedDate && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm z-10">
                        {formattedDate}
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl md:text-2xl font-bold text-brand-orange mb-3 line-clamp-2 theme-transition-colors">
                    {post.title}
                </h3>
                <p className="text-[var(--foreground)] text-sm md:text-base line-clamp-3 leading-relaxed theme-transition-colors flex-grow">
                    {post.content}
                </p>
                {isActive && (
                    <Link
                        to={`/news/${post.id}`}
                        className="inline-block mt-6 self-start bg-brand-orange text-brand-black font-semibold py-2 px-6 rounded-lg hover:bg-brand-yellow transition-all duration-300 theme-transition-colors shadow-md"
                    >
                        Read More
                    </Link>
                )}
            </div>
        </article>
    );
}