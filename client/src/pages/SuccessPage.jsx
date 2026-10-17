import { useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';

export default function SuccessPage() {
    const order = useLocation().state?.order;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Opened directly (no order in navigation state) - nothing to confirm.
    if (!order) return <Navigate to="/profile" replace />;

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 theme-transition-colors animate-fadeIn">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-green-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">Order #{order.id} placed!</h1>
            <p className="text-[color-mix(in_oklab,var(--foreground)_70%,transparent)] mb-8 max-w-md">
                Thank you for your purchase. Total: <strong>${order.total.toFixed(2)}</strong>.
                You can follow the order status in your profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to="/profile"
                    className="bg-brand-orange text-brand-black font-bold py-3 px-8 rounded-xl hover:bg-brand-yellow transition-all duration-300 shadow-md"
                >
                    View my orders
                </Link>
                <Link
                    to="/shop"
                    className="border-2 border-brand-orange text-brand-orange font-bold py-3 px-8 rounded-xl hover:bg-brand-orange hover:text-brand-black transition-all duration-300"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
