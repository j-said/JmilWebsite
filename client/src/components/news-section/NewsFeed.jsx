import { useState, useEffect, useRef } from 'react';
import NewsCard from './NewsCard';
import Pagination from '../ui/Pagination';
import { newsService } from '../../services/newsService';

export default function NewsSection() {
  const [carouselPosts, setCarouselPosts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoRotateRef = useRef(null);

  // Ref for scrolling to the grid top
  const newsGridRef = useRef(null);

  const [showAllNews, setShowAllNews] = useState(false);
  const [gridPosts, setGridPosts] = useState([]);
  const [gridPage, setGridPage] = useState(1);
  const [totalGridPages, setTotalGridPages] = useState(0);
  const [isLoadingGrid, setIsLoadingGrid] = useState(false);
  const [error, setError] = useState(null);

  const CAROUSEL_LIMIT = 5;
  const GRID_LIMIT = 6;

  // Carousel: the latest posts
  useEffect(() => {
    newsService
      .getNews({ page: 1, limit: CAROUSEL_LIMIT })
      .then((data) => setCarouselPosts(data.items))
      .catch(() => setError('Could not load news.'));
  }, []);

  // Grid: paginated, loaded only once the user expands it
  useEffect(() => {
    if (!showAllNews) return;
    let ignore = false;
    setIsLoadingGrid(true);
    newsService
      .getNews({ page: gridPage, limit: GRID_LIMIT })
      .then((data) => {
        if (ignore) return;
        setGridPosts(data.items);
        setTotalGridPages(data.pages);
      })
      .catch(() => !ignore && setError('Could not load news.'))
      .finally(() => !ignore && setIsLoadingGrid(false));
    return () => {
      ignore = true;
    };
  }, [showAllNews, gridPage]);

  // Handle Page Change with "Smoother" Scroll
  const handlePageChange = (newPage) => {
    setGridPage(newPage);

    // Use setTimeout to allow the DOM to update height before scrolling
    setTimeout(() => {
      if (newsGridRef.current) {
        const headerOffset = 150;
        const elementPosition = newsGridRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 100); // 100ms delay to smooth out the transition
  };

  // Auto-Rotate Logic
  useEffect(() => {
    if (carouselPosts.length > 0 && !isPaused) {
      autoRotateRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % carouselPosts.length);
      }, 4000);
      return () => clearInterval(autoRotateRef.current);
    }
  }, [carouselPosts.length, isPaused]);

  const handleCardClick = (index) => { setIsPaused(true); setActiveIndex(index); };
  const navigateCard = (direction) => {
    setIsPaused(true);
    if (direction === 'next') {
      setActiveIndex((prev) => (prev + 1) % carouselPosts.length);
    } else {
      setActiveIndex((prev) => (prev - 1 + carouselPosts.length) % carouselPosts.length);
    }
    setTimeout(() => setIsPaused(false), 5000);
  };

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4 text-center text-brand-orange theme-transition-colors">
          Latest News
        </h2>
        {error && <p className="text-center text-red-500 mb-6">{error}</p>}

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto mb-12">
          <button onClick={() => navigateCard('prev')} className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-brand-orange text-brand-black p-3 rounded-full hover:bg-brand-yellow shadow-lg -translate-x-2 md:-translate-x-6">‹</button>
          <button onClick={() => navigateCard('next')} className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-brand-orange text-brand-black p-3 rounded-full hover:bg-brand-yellow shadow-lg translate-x-2 md:translate-x-6">›</button>

          <div className="relative h-[450px] flex items-center justify-center" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
            {carouselPosts.map((post, index) => (
              <div
                key={post.id}
                onClick={() => handleCardClick(index)}
                className="absolute transition-all duration-500 ease-in-out cursor-pointer"
                style={{
                  transform: `translateX(${(index - activeIndex) * 110}%) scale(${index === activeIndex ? 1 : 0.9})`,
                  zIndex: index === activeIndex ? 30 : 20 - Math.abs(index - activeIndex),
                  opacity: Math.abs(index - activeIndex) > 2 ? 0 : 1 - Math.abs(index - activeIndex) * 0.3,
                }}
              >
                <NewsCard post={post} isActive={index === activeIndex} className="w-80 md:w-96" />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center">
          <button
            onClick={() => setShowAllNews(!showAllNews)}
            className="bg-brand-orange text-brand-black font-bold py-4 px-8 rounded-xl hover:bg-brand-yellow transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
          >
            {showAllNews ? 'Hide News' : 'View More News'}
          </button>
        </div>

        {/* Pagination Grid */}
        {showAllNews && (
          <div ref={newsGridRef} className="animate-fadeIn p-8 rounded-3xl">
            {isLoadingGrid ? (
              <div className="text-center py-12 text-xl text-[var(--foreground)]">Loading...</div>
            ) : (
              <>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-8">
                  {gridPosts.map(post => (
                    <div key={post.id} className="flex justify-center h-full transform hover:scale-[1.02] transition-transform duration-300">
                      <NewsCard post={post} isActive={true} className="w-full h-full" />
                    </div>
                  ))}
                </div>

                {/* Bottom Pagination */}
                <Pagination
                  currentPage={gridPage}
                  totalPages={totalGridPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}