import { useState, useEffect, useRef } from 'react';
import NewsCard from './NewsCard';

export default function NewsSection() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoRotateRef = useRef(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('http://localhost:3001/api/news');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (e) {
        setError(e.message);
        console.error('Failed to fetch news:', e);
        // Set mock data on failure
        setPosts([
          { id: 1, title: 'New Drone Technology', content: 'Discover the latest advancements in drone technology and how they are revolutionizing various industries.' },
          { id: 2, title: 'FPV Racing Championship', content: 'Join us for the annual FPV racing championship featuring the best pilots from around the world.' },
          { id: 3, title: 'Drone Photography Tips', content: 'Learn professional drone photography techniques to capture stunning aerial shots.' },
          { id: 4, title: 'Agricultural Drones', content: 'How drones are transforming modern agriculture with precision farming techniques.' },
          { id: 5, title: 'Safety Regulations Update', content: 'Important updates to drone safety regulations and compliance requirements.' },
        ]);
      }
    }
    fetchNews();
  }, []);

  // Auto-rotate functionality
  useEffect(() => {
    if (posts.length > 0 && !isPaused) {
      autoRotateRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % posts.length);
      }, 4000); // Change card every 4 seconds

      return () => clearInterval(autoRotateRef.current);
    }
  }, [posts.length, isPaused]);

  const handleCardHover = (index) => {
    setIsPaused(true);
    setActiveIndex(index);
  };

  const handleCardLeave = () => {
    setIsPaused(false);
  };

  const navigateCard = (direction) => {
    setIsPaused(true);
    setActiveIndex((prev) => {
      if (direction === 'next') {
        return (prev + 1) % posts.length;
      } else {
        return (prev - 1 + posts.length) % posts.length;
      }
    });

    // Resume auto-rotation after manual navigation
    setTimeout(() => setIsPaused(false), 5000);
  };

  if (posts.length === 0) {
    return <div className="py-16 text-center theme-transition">Loading news...</div>;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-[var(--background)] to-[color-mix(in_oklab,var(--background)_95%,var(--muted))] theme-transition">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4 text-center text-brand-orange theme-transition">
          Latest News
        </h2>
        <p className="text-lg text-[color-mix(in_oklab,var(--foreground)_80%,transparent)] text-center mb-12 max-w-2xl mx-auto theme-transition">
          Stay updated with the latest developments in drone technology and industry news
        </p>

        {error && (
          <div className="text-center text-red-400 mb-8 bg-red-400/10 py-2 px-4 rounded-lg max-w-md mx-auto theme-transition">
            Could not load news. Displaying mock data.
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() => navigateCard('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-brand-orange text-brand-black p-3 rounded-full hover:bg-brand-yellow transition-all duration-300 shadow-lg theme-transition"
          >
            ‹
          </button>

          <button
            onClick={() => navigateCard('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-brand-orange text-brand-black p-3 rounded-full hover:bg-brand-yellow transition-all duration-300 shadow-lg theme-transition"
          >
            ›
          </button>

          {/* Cards Container */}
          <div
            className="flex justify-center items-center space-x-8 overflow-visible py-8"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {posts.map((post, index) => (
              <div
                key={post.id}
                onMouseEnter={() => handleCardHover(index)}
                onMouseLeave={handleCardLeave}
                className="transition-all duration-500 ease-in-out theme-transition"
              >
                <NewsCard
                  post={post}
                  isActive={index === activeIndex}
                  index={index}
                  totalCards={posts.length}
                />
              </div>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex justify-center space-x-3 mt-8">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsPaused(true);
                  setActiveIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 theme-transition ${index === activeIndex
                    ? 'bg-brand-orange scale-125'
                    : 'bg-brand-orange/30 hover:bg-brand-orange/60'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}