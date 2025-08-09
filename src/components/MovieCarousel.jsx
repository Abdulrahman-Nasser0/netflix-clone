import React, { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MovieCard from "./ui/MovieCard";

const MovieCarousel = ({
  title = "",
  movies,
  mediaType = "movie",
  onMovieClick,
}) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
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
    <div className="relative my-[3vw]">
      {/* Section Title */}
      <h2 className="text-white text-xl md:text-2xl font-bold mb-2 px-4 md:px-16">
        {title}
      </h2>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="absolute inset-y-0 left-0 z-10 text-white w-10 md:w-12 flex items-center justify-start px-2
           bg-gradient-to-r from-black/40 to-transparent
           opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            <FaChevronLeft className="text-2xl" />
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="absolute inset-y-0 right-0 z-10 text-white w-10 md:w-12 flex items-center justify-end px-2
           bg-gradient-to-l from-black/40 to-transparent
           opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            <FaChevronRight className="text-2xl" />
          </button>
        )}

        {/* Movies Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-scroll scrollbar-hide  md:px-16 "
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie, index) => (
            <div key={index} className="flex-none">
              <MovieCard
                movie={movie}
                mediaType={mediaType}
                onMovieClick={onMovieClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;
