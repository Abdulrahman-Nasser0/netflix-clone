import React, { useState } from 'react';
import { useMyList } from '../../contexts/MyListContext';

const MovieCard = ({ movie }) => {
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Local loading state
  const { addToMyList } = useMyList();
  
  const handleMovieClick = async () => {
    // Prevent multiple clicks while processing
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      await addToMyList(movie);
      
      // Show toast only for this specific card
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error('Error adding movie:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="m-3 relative cursor-pointer transition-transform duration-200 hover:scale-105"
      onClick={handleMovieClick}
    >
      <div className="overflow-hidden rounded-sm w-[15rem] h-[8rem]">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title || movie.name || 'Movie poster'}
          className="object-cover w-full h-full transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.src = '/images/no-image.jpg'; // Fallback image
          }}
        />
      </div>

      {/* Use local loading state instead of global */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* This toast is now unique to each card */}
      {showToast && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded z-10">
          Added!
        </div>
      )}
    </div>
  );
};

export default MovieCard;