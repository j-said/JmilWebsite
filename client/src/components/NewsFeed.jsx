import { useState, useEffect } from 'react';

// Import the child component
import NewsCard from './NewsCard';

export default function NewsSection() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

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
          {id: 1, title: 'Mock Post 1', content: 'This is mock content because the API failed.'},
          {id: 2, title: 'Mock Post 2', content: 'Horizontal scrolling is working.'},
          {id: 3, title: 'Mock Post 3', content: 'This card is a PNG mockup placeholder.'},
          {id: 4, title: 'Mock Post 4', content: 'Another item to fill the space.'},
        ]);
      }
    }
    fetchNews();
  }, []); // Runs once on component mount

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-8 text-center text-brand-orange">Latest News</h2>
      
      {error && <p className="text-center text-red-500 mb-4">Could not load news. Displaying mock data.</p>}
      
      <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-brand-black scrollbar-thumb-brand-orange">
        {posts.map((post) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}