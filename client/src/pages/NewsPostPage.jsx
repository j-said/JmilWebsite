import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { newsService } from '../services/newsService';

export default function NewsPostPage() {
    const { id } = useParams();
    const [state, setState] = useState({ post: null, error: null });

    useEffect(() => {
        let ignore = false;
        newsService
            .getPost(id)
            .then((post) => !ignore && setState({ post, error: null }))
            .catch(() => !ignore && setState({ post: null, error: 'News post not found' }));
        return () => {
            ignore = true;
        };
    }, [id]);

    const { post, error } = state;

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-[var(--foreground)]">
                <h2 className="text-2xl font-bold mb-4">{error}</h2>
                <Link to="/" className="text-brand-orange font-bold hover:underline">Back to home</Link>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex justify-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
            </div>
        );
    }

    const imageUrl = post.imageUrl || `https://placehold.co/1200x500/1a1a1a/FFA500?text=${encodeURIComponent(post.title)}`;

    return (
        <article className="container mx-auto px-4 py-12 max-w-3xl animate-fadeIn theme-transition-colors">
            <Link to="/" className="text-sm text-brand-orange hover:underline">← All news</Link>
            <h1 className="text-4xl font-bold text-brand-orange mt-4 mb-2">{post.title}</h1>
            <p className="text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] mb-8">
                {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <img src={imageUrl} alt="" className="w-full rounded-2xl mb-8 border border-[var(--muted)]" />
            <p className="text-lg leading-relaxed text-[var(--foreground)] whitespace-pre-line">{post.content}</p>
        </article>
    );
}
