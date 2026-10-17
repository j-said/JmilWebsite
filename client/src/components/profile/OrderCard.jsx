import { Link } from 'react-router-dom';

const STATUS_STYLES = {
    pending: 'text-yellow-500 bg-yellow-500/10',
    paid: 'text-blue-500 bg-blue-500/10',
    shipped: 'text-green-500 bg-green-500/10',
    cancelled: 'text-red-500 bg-red-500/10',
};

const formatDate = (iso) =>
    new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

export default function OrderCard({ order }) {
    return (
        <article
            className="border border-[var(--muted)] rounded-2xl p-5 bg-[var(--background)] theme-transition-colors"
        >
            <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                    <h3 className="font-bold text-lg text-[var(--foreground)]">Order #{order.id}</h3>
                    <p className="text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)]">
                        {formatDate(order.createdAt)}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold capitalize ${STATUS_STYLES[order.status] ?? ''}`}>
                        {order.status}
                    </span>
                    <span className="text-xl font-bold text-brand-orange">${order.total.toFixed(2)}</span>
                </div>
            </header>

            <ul className="divide-y divide-[var(--muted)]">
                {order.items.map((item) => (
                    <li key={item.productId} className="flex items-center gap-4 py-3">
                        <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-14 h-14 object-cover rounded-lg border border-[var(--muted)] flex-shrink-0"
                        />
                        <Link
                            to={`/shop/${item.productId}`}
                            className="flex-1 min-w-0 font-medium text-[var(--foreground)] hover:text-brand-orange line-clamp-1"
                        >
                            {item.productName}
                        </Link>
                        <span className="text-sm text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] whitespace-nowrap">
                            {item.quantity} × ${item.unitPrice.toFixed(2)}
                        </span>
                        <span className="w-24 text-right font-semibold text-[var(--foreground)]">
                            ${item.subtotal.toFixed(2)}
                        </span>
                    </li>
                ))}
            </ul>

            <footer className="mt-4 pt-3 border-t border-[var(--muted)] text-sm text-[color-mix(in_oklab,var(--foreground)_70%,transparent)]">
                Recipient: {order.firstName} {order.lastName}, {order.phone}
                {order.notes && <span className="block mt-1">Notes: {order.notes}</span>}
            </footer>
        </article>
    );
}
