import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 text-[var(--foreground)]">
            <h1 className="text-6xl font-bold text-brand-orange mb-4">404</h1>
            <p className="mb-8">This page flew away.</p>
            <Link to="/" className="bg-brand-orange text-brand-black font-bold py-3 px-8 rounded-xl hover:bg-brand-yellow transition-colors">
                Go home
            </Link>
        </div>
    );
}
