import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { getErrorMessage } from '../api/axiosClient';
import OrderCard from '../components/profile/OrderCard';
import Pagination from '../components/ui/Pagination';
import Alert from '../components/ui/Alert';

const ORDERS_PER_PAGE = 5;

export default function ProfilePage() {
    const { user, logout } = useAuth();

    const [page, setPage] = useState(1);
    const [orders, setOrders] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;
        orderService
            .getMyOrders({ page, limit: ORDERS_PER_PAGE })
            .then((data) => !ignore && setOrders(data))
            .catch((err) => !ignore && setError(getErrorMessage(err)));
        return () => {
            ignore = true;
        };
    }, [page]);

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl animate-fadeIn theme-transition-colors">
            <section className="flex flex-wrap items-start justify-between gap-4 mb-10 p-6 rounded-2xl border border-[var(--muted)]">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--foreground)] mb-1">
                        {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-[color-mix(in_oklab,var(--foreground)_70%,transparent)]">{user.email}</p>
                    {user.phone && (
                        <p className="text-[color-mix(in_oklab,var(--foreground)_70%,transparent)]">{user.phone}</p>
                    )}
                    <p className="text-sm mt-2 text-[color-mix(in_oklab,var(--foreground)_50%,transparent)]">
                        Member since {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </p>
                </div>
                <button
                    onClick={logout}
                    className="px-5 py-2 rounded-xl border border-[var(--muted)] text-[var(--foreground)] hover:border-red-500 hover:text-red-500 transition-colors"
                >
                    Sign out
                </button>
            </section>

            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">My orders</h2>

            <Alert>{error}</Alert>

            {orders === null && !error && (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange"></div>
                </div>
            )}

            {orders?.total === 0 && (
                <div className="text-center py-12 text-[var(--foreground)]">
                    <p className="mb-4">You have no orders yet.</p>
                    <Link to="/shop" className="text-brand-orange font-bold hover:underline">
                        Browse the shop
                    </Link>
                </div>
            )}

            {orders?.items.length > 0 && (
                <div className="space-y-6">
                    {orders.items.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}

            <div className="mt-10">
                <Pagination currentPage={page} totalPages={orders?.pages ?? 0} onPageChange={setPage} />
            </div>
        </div>
    );
}
