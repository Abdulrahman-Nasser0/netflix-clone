import React, { useState, useEffect } from "react";
import { FaTimes, FaPlay, FaPlus, FaMinus, FaStar } from "react-icons/fa";
import { tmdbApi } from "../../services/api/tmdb";
import { useMyList } from "../../contexts/MyListContext";
import MovieCarousel from "../MovieCarousel";

const MovieModal = ({ movie, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToMyList, removeFromMyList, isInMyList } = useMyList();

  // Determine media type
  const mediaType = movie.name && !movie.title ? "tv" : "movie";
  const inMyList = isInMyList(movie.id, mediaType);

  useEffect(() => {
    if (!movie) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = mediaType === "tv" ? "tv" : "movie";

        // Fetch details, cast, videos, and similar content in parallel
        const [detailsRes, creditsRes, videosRes, similarRes] =
          await Promise.all([
            tmdbApi.get(`/${endpoint}/${movie.id}`, { language: "en-US" }),
            tmdbApi.get(`/${endpoint}/${movie.id}/credits`, { language: "en-US" }),
            tmdbApi.get(`/${endpoint}/${movie.id}/videos`, { language: "en-US" }),
            tmdbApi.get(`/${endpoint}/${movie.id}/similar`, { language: "en-US", page: 1 }),
          ]);

        setMovieDetails(detailsRes);
        setCast(creditsRes.cast?.slice(0, 10) || []);
        setVideos(
          videosRes.results
            ?.filter((video) => video.type === "Trailer")
            .slice(0, 3) || []
        );
        setSimilarMovies(similarRes.results?.slice(0, 12) || []);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movie, mediaType]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden"; // Prevent background scroll

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleToggleMyList = async () => {
    try {
      if (inMyList) {
        await removeFromMyList({ tmdbId: movie.id, mediaType });
      } else {
        await addToMyList({ tmdbId: movie.id, mediaType });
      }
    } catch (error) {
      console.error("Error toggling my list:", error);
    }
  };

  const openTrailer = (videoKey) => {
    window.open(`https://www.youtube.com/watch?v=${videoKey}`, "_blank");
  };

  if (!movie) return null;

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar {
          /* Hide scrollbar on all platforms, scrolling still works */
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge Legacy */
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 0 !important; /* Chrome, Safari, Opera */
          height: 0 !important;
          background: transparent;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 "
        onClick={onClose}
      >
        {/* Modal Container */}
        <div className="fixed inset-0 top-35 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div
            className="bg-gray-900 rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >

            {loading ? (
              <div className="p-4 sm:p-8 text-center ">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-300 text-sm sm:text-base">
                  Loading details...
                </p>
              </div>
            ) : error ? (
              <div className="p-4 sm:p-8 text-center">
                <p className="text-red-400 mb-4 text-sm sm:text-base">
                  {error}
                </p>
                <button
                  onClick={onClose}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded text-white text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Hero Section */}
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-t from-gray-900 to-transparent relative">
                    <img
                      src={`https://image.tmdb.org/t/p/w1280${
                        movieDetails?.backdrop_path || movie.backdrop_path
                      }`}
                      alt={movieDetails?.title || movieDetails?.name}
                      className="w-full h-full object-cover object-bottom-right rounded-t-lg  min-h-[15rem]"
                      onError={(e) => {
                        e.target.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                      }}
                    />
                    <button
                      onClick={onClose}
                      className="absolute top-2 cursor-pointer right-2 z-10 bg-black/50 hover:bg-black/70 rounded-full p-1.5 sm:p-2 transition-colors"
                    >
                      <FaTimes className="text-white w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 lg:p-8 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent">
                    <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold text-white mb-2 sm:mb-4 line-clamp-2">
                      {movieDetails?.title || movieDetails?.name}
                    </h1>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                      {/* Play Trailer Button */}
                      {videos.length > 0 && (
                        <button
                          onClick={() => openTrailer(videos[0].key)}
                          className="flex items-center space-x-2 bg-white hover:bg-gray-200 text-black px-3 py-2 sm:px-6 sm:py-3 rounded font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
                        >
                          <FaPlay className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Play Trailer</span>
                        </button>
                      )}

                      {/* Add/Remove from List */}
                      <button
                        onClick={handleToggleMyList}
                        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 sm:px-6 sm:py-3 rounded font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
                      >
                        {inMyList ? (
                          <>
                            <FaMinus className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">
                              Remove from List
                            </span>
                            <span className="sm:hidden">Remove</span>
                          </>
                        ) : (
                          <>
                            <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">
                              Add to List
                            </span>
                            <span className="sm:hidden">Add</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Rating and Info */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-300">
                      {movieDetails?.vote_average && (
                        <div className="flex items-center space-x-1">
                          <FaStar className="text-yellow-500 w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{movieDetails.vote_average.toFixed(1)}/10</span>
                        </div>
                      )}

                      {(movieDetails?.release_date ||
                        movieDetails?.first_air_date) && (
                        <span>
                          {new Date(
                            movieDetails.release_date ||
                              movieDetails.first_air_date
                          ).getFullYear()}
                        </span>
                      )}

                      {movieDetails?.runtime && (
                        <span className="hidden sm:inline">
                          {movieDetails.runtime} min
                        </span>
                      )}

                      {movieDetails?.number_of_seasons && (
                        <span>
                          {movieDetails.number_of_seasons} Season
                          {movieDetails.number_of_seasons > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Sections */}
                <div className="p-3 sm:p-6 lg:p-8">
                  {/* Overview */}
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4">
                      Overview
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      {movieDetails?.overview || "No overview available."}
                    </p>
                  </div>

                  {/* Genres */}
                  {movieDetails?.genres && movieDetails.genres.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                      <h3 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-3">
                        Genres
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {movieDetails.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="bg-gray-800 text-gray-300 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cast */}
                  {cast.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                      <h3 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-4">
                        Cast
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
                        {cast
                          .slice(0, window.innerWidth < 640 ? 6 : 10)
                          .map((actor) => (
                            <div key={actor.id} className="text-center">
                              <div className="w-full aspect-[3/4] mb-1 sm:mb-2 bg-gray-800 rounded overflow-hidden">
                                <img
                                  src={
                                    actor.profile_path
                                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                      : "/no-image.jpg"
                                  }
                                  alt={actor.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = "/no-image.jpg";
                                  }}
                                />
                              </div>
                              <p className="text-white text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 line-clamp-2">
                                {actor.name}
                              </p>
                              <p className="text-gray-400 text-xs line-clamp-2">
                                {actor.character}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Similar Movies - Only show on larger screens */}
                  {similarMovies.length > 0 && (
                    <div className="mb-6 pb-12 sm:mb-8 hidden sm:block">
                      <h3 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-4">
                        More Like This
                      </h3>
                      <MovieCarousel movies={similarMovies} />
                    </div>
                  )}

                  {/* Similar Movies Grid for Mobile */}
                  {similarMovies.length > 0 && (
                    <div className="mb-6 sm:hidden">
                      <h3 className="text-base font-bold text-white mb-3">
                        More Like This
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {similarMovies.slice(0, 6).map((similarMovie) => (
                          <div key={similarMovie.id} className="aspect-[2/3]">
                            <img
                              src={`https://image.tmdb.org/t/p/w300${similarMovie.poster_path}`}
                              alt={similarMovie.title || similarMovie.name}
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieModal;
