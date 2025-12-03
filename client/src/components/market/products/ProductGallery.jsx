import { useState } from "react";

export default function ProductGallery({ product }) {
  // Collect all images: main image + additional images
  const images = [product.imageUrl, ...(product.images || [])].filter(Boolean); // Remove potential null/undefined

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="space-y-4 theme-transition-colors">
      {/* Main Image Frame */}
      <div
        className="relative rounded-2xl overflow-hidden border border-[--muted] shadow-lg group bg-[--background] aspect-4/3 cursor-zoom-in theme-transition-colors"
        onClick={openModal}
      >
        <img
          src={images[selectedImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.onSale && (
          <span className="absolute top-4 left-4 bg-brand-orange text-brand-black font-bold px-3 py-1 rounded-full shadow-md z-10">
            Sale
          </span>
        )}

        {/* Carousel Controls (visible on hover) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-orange hover:text-brand-black"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-orange hover:text-brand-black"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`
                                border rounded-lg overflow-hidden transition-all duration-200 aspect-square relative
                                ${
                                  selectedImageIndex === idx
                                    ? "border-brand-orange ring-2 ring-brand-orange/20 opacity-100"
                                    : "border-[--muted] opacity-70 hover:opacity-100 hover:border-brand-orange"
                                }
                            `}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 hover:text-brand-orange transition-colors"
            onClick={closeModal}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute -left-12 text-white p-4 hover:text-brand-orange transition-colors"
              >
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            <img
              src={images[selectedImageIndex]}
              alt={product.name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute -right-12 text-white p-4 hover:text-brand-orange transition-colors"
              >
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
