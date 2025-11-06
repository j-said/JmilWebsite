export default function NewsCard({ post }) {
    const imageUrl = post.imageUrl || `https://placehold.co/400x300/1a1a1a/FFA500?text=${post.title.replace(' ', '+')}`;

    return (
        <article className="flex-shrink-0 w-80 bg-brand-black rounded-lg shadow-lg overflow-hidden snap-start">
            <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/1a1a1a/FFFFFF?text=Image+Error'; }}
            />
            <div className="p-4">
                <h3 className="text-lg font-bold text-brand-orange mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-brand-white text-sm line-clamp-3">{post.content}</p>
            </div>
        </article>
    );
}