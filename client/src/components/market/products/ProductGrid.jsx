import ProductCard from "./ProductCard";

export default function ProductGrid({ products, title, subtitle }) {
  if (!products || products.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[--foreground] mb-4 theme-transition-colors">
              No products found
            </h2>
            <p className="text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] theme-transition-colors">
              Try adjusting your search or filters.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h2 className="text-3xl font-bold text-[--foreground] mb-4 theme-transition-colors">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-[color-mix(in_oklab,var(--foreground)_60%,transparent)] max-w-2xl mx-auto theme-transition-colors">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More (optional) */}
        <div className="text-center mt-8">
          <button className="bg-brand-orange text-brand-black font-semibold py-3 px-8 rounded-lg hover:bg-brand-yellow transition-all duration-300 theme-transition-colors">
            Load More Products
          </button>
        </div>
      </div>
    </section>
  );
}
