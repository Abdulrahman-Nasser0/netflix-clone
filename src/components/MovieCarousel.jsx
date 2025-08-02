import React, { useState, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const MovieCarousel = ({ title, movies, isLargeRow = false }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="relative group mb-8">
      {/* Section Title */}
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-4 md:px-16">
        {title}
      </h2>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FaChevronLeft className="text-xl" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <FaChevronRight className="text-xl" />
          </button>
        )}

        {/* Movies Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-scroll scrollbar-hide space-x-4 px-4 md:px-16 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className={`flex-none group cursor-pointer transition-transform duration-300 hover:scale-105 ${
                isLargeRow ? 'w-40 md:w-48' : 'w-32 md:w-40'
              }`}
            >
              <div className={`overflow-hidden rounded-lg ${
                isLargeRow ? 'aspect-[2/3]' : 'aspect-[16/9]'
              }`}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${
                    isLargeRow ? movie.poster_path : movie.backdrop_path || movie.poster_path
                  }`}
                  alt={movie.name || movie.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              
              {/* Movie Title */}
              <div className="mt-2 px-1">
                <h3 className="text-white text-xs md:text-sm font-medium truncate">
                  {movie.name || movie.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;
