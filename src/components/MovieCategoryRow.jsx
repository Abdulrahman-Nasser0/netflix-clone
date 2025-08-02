import { useState, useEffect } from 'react';
import { tmdbApi } from '../services/api/tmdb';
import MovieCarousel from './MovieCarousel';

const MovieCategoryRow = ({ category }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await tmdbApi.get(category.endpoint);
        setMovies(data.results.slice(0, 20)); // limit to 20 movies
      } catch (error) {
        console.error(`Failed to fetch ${category.title}:`, error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category]);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="px-4 md:px-16">
          <div className="h-6 bg-gray-700 rounded mb-4 w-48 animate-pulse"></div>
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex-none w-32 md:w-40">
                <div className={`bg-gray-700 rounded-lg animate-pulse ${
                  category.isLargeRow ? 'aspect-[2/3]' : 'aspect-[16/9]'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <MovieCarousel 
      title={category.title} 
      movies={movies} 
      isLargeRow={category.isLargeRow} 
    />
  );
};

export default MovieCategoryRow;
