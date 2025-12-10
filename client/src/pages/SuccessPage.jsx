import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function SuccessPage() {
    // 1. Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 theme-transition-colors animate-fadeIn">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">Order Placed Successfully!</h1>
            <p className="text-[color-mix(in_oklab,var(--foreground)_70%,transparent)] mb-8 max-w-md">
                Thank you for your purchase. We will send you an email confirmation shortly.
            </p>
            <Link
                to="/shop"
                className="bg-brand-orange text-brand-black font-bold py-3 px-8 rounded-xl hover:bg-brand-yellow transition-all duration-300 shadow-md"
            >
                Continue Shopping
            </Link>
        </div>
    );
}