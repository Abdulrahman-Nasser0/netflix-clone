import React, { useState } from "react";
import { useMyList } from "../../contexts/MyListContext";

const MovieCard = ({ movie, onMovieClick }) => {
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();

  // Check if movie is in list
  const mediaType = movie.name && !movie.title ? 'tv' : 'movie';
  const inMyList = isInMyList(movie.id, mediaType);

  const handleCardClick = () => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  const handleAddToListClick = async (e) => {
    e.stopPropagation(); // Prevent modal from opening
    if (isLoading) return;

    try {
      setIsLoading(true);
      
      let detectedMediaType = 'movie';
      
      if (movie.name && !movie.title) {
        detectedMediaType = 'tv';
      } else if (movie.first_air_date) {
        detectedMediaType = 'tv';
      } else if (movie.release_date) {
        detectedMediaType = 'movie';
      }
      
      if (inMyList) {
        await removeFromMyList({
          tmdbId: movie.id,
          mediaType: detectedMediaType
        });
        setToastMessage('Removed from My List');
      } else {
        await addToMyList({
          tmdbId: movie.id,
          mediaType: detectedMediaType
        });
        setToastMessage('Added to My List');
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error("Error updating movie list:", error);
      setToastMessage('Sign in to manage your list!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="m-3 relative group">
      {/* Main Movie Card - Click to open modal */}
      <div
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
        onClick={handleCardClick}
      >
        <div className="overflow-hidden rounded-sm w-[15rem] h-[8rem]">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title || movie.name || "Movie poster"}
            className="object-cover w-full h-full transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.src = "/no-image.jpg";
            }}
          />
        </div>
      </div>

      {/* Add to List Button - Appears on hover */}
      <button
        onClick={handleAddToListClick}
        className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        title={inMyList ? "Remove from My List" : "Add to My List"}
      >
        {inMyList ? "-" : "+"}
      </button>

      {/* Visual indicator for items in list */}
      {inMyList && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-10">
          ✓ In List
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Toast notification */}
      {showToast && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded z-20">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default MovieCard;
