import ProductCard from './ProductCard';

export default function SimilarProducts({ products }) {
    if (!products || products.length === 0) return null;

    return (
        <div className="border-t border-[--muted] pt-16 mt-16 theme-transition-colors">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[--foreground] theme-transition-colors">
                Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(p => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
}