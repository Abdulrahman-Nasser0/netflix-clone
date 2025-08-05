import React, { useState } from "react";
import { useMyList } from "../../contexts/MyListContext";

const MovieCard = ({ movie }) => {
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Local loading state
  const [toastMessage, setToastMessage] = useState('');
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();

  // Check if movie is in list
  const mediaType = movie.name && !movie.title ? 'tv' : 'movie';
  const inMyList = isInMyList(movie.id, mediaType);

  const handleMovieClick = async () => {
    // Prevent multiple clicks while processing
    if (isLoading) return;

    try {
      setIsLoading(true);
      
      // ✅ Better media type detection with multiple fallbacks
      let detectedMediaType = 'movie'; // Default to movie
      
      if (movie.name && !movie.title) {
        detectedMediaType = 'tv'; // Has name but no title = TV show
      } else if (movie.first_air_date) {
        detectedMediaType = 'tv'; // Has first_air_date = TV show
      } else if (movie.release_date) {
        detectedMediaType = 'movie'; // Has release_date = Movie
      }
      
      console.log('Movie click:', {
        id: movie.id,
        title: movie.title || movie.name,
        mediaType: detectedMediaType,
        inMyList,
        hasTitle: !!movie.title,
        hasName: !!movie.name,
        hasReleaseDate: !!movie.release_date,
        hasFirstAirDate: !!movie.first_air_date
      });
      
      if (inMyList) {
        // Remove from list
        await removeFromMyList({
          tmdbId: movie.id,
          mediaType: detectedMediaType
        });
        setToastMessage('Removed from My List');
      } else {
        // Add to list
        await addToMyList({
          tmdbId: movie.id,
          mediaType: detectedMediaType
        });
        setToastMessage('Added to My List');
      }

      // Show toast only for this specific card
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error("Error updating movie list:", error);
      setToastMessage('Error updating list');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
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
          alt={movie.title || movie.name || "Movie poster"}
          className="object-cover w-full h-full transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.src = "/images/no-image.jpg"; // Fallback image
          }}
        />
      </div>

      {/* Visual indicator for items in list */}
      {inMyList && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-10">
          ✓ In List
        </div>
      )}

      {/* Use local loading state instead of global */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* This toast is now unique to each card and shows dynamic message */}
      {showToast && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded z-10">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default MovieCard;
