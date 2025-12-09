import { useState, useEffect, useRef } from 'react';
import NewsCard from './NewsCard';
import Pagination from '../ui/Pagination';

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
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoadingGrid, setIsLoadingGrid] = useState(false);
  const [error, setError] = useState(null);

  const CAROUSEL_LIMIT = 5;
  const GRID_LIMIT = 6;

  // Initial Fetch
  useEffect(() => {
    async function fetchCarousel() {
      try {
        const response = await fetch(`http://localhost:3001/api/news?limit=${CAROUSEL_LIMIT}&offset=0`);
        const result = await response.json();
        const posts = Array.isArray(result) ? result : result.data;
        const total = result.pagination ? result.pagination.total : posts.length;
        setCarouselPosts(posts);
        setTotalPosts(total);
      } catch (e) {
        setError(e.message);
        // Fallback data...
        setCarouselPosts([
          { id: 1, title: 'New Drone Technology', content: 'Discover...', created_at: '2025-10-05' },
          { id: 2, title: 'FPV Racing', content: 'Join us...', created_at: '2025-10-04' },
          { id: 3, title: 'Photography Tips', content: 'Learn...', created_at: '2025-10-03' },
          { id: 4, title: 'Agri Drones', content: 'Transforming...', created_at: '2025-10-02' },
          { id: 5, title: 'Safety Update', content: 'Regulations...', created_at: '2025-10-01' },
        ]);
      }
    }
    fetchCarousel();
  }, []);

  // Grid Fetch
  useEffect(() => {
    if (!showAllNews) return;

    async function fetchGrid() {
      setIsLoadingGrid(true);
      try {
        const offset = (gridPage - 1) * GRID_LIMIT;
        const response = await fetch(`http://localhost:3001/api/news?limit=${GRID_LIMIT}&offset=${offset}`);
        const result = await response.json();
        setGridPosts(result.data || []);
      } catch (e) {
        console.error("Grid fetch error", e);
      } finally {
        setIsLoadingGrid(false);
      }
    }
    fetchGrid();
  }, [showAllNews, gridPage]);

  const totalGridPages = Math.ceil(totalPosts / GRID_LIMIT);

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
                {/* <Pagination
                  currentPage={gridPage}
                  totalPages={totalGridPages}
                  onPageChange={handlePageChange}
                /> */}

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