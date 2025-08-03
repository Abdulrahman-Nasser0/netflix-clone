import { useEffect, useState } from "react";
import { tmdbApi, endpoints } from "../services/api/tmdb";
import MovieCarousel from "./MovieCarousel";

const Movies = ({ endpoint, title, isLargeRow = false }) => {
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await tmdbApi.get(
          endpoint || endpoints.fetchNetflixOriginals
        );
        setMovieList(data.results.slice(0, 20)); // Limit to 20 movies
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        setError("Failed to fetch movies");
      } finally {
        setLoading( );
      }
    };

    fetchMovies();
  }, [endpoint]);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="px-4 md:px-16">
          <div className="h-6 bg-gray-700 rounded mb-4 w-48 animate-pulse"></div>
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex-none w-32 md:w-40">
                <div
                  className={`bg-gray-700 rounded-lg animate-pulse ${
                    isLargeRow ? "aspect-[2/3]" : "aspect-[16/9]"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-lg font-bold mt-10 text-white px-4 md:px-16">
        Something went wrong! Please try again.
      </div>
    );
  }

  if (!movieList.length) {
    return (
      <div className="text-center text-lg font-bold mt-10 text-white px-4 md:px-16">
        No movies found
      </div>
    );
  }

  return (
    <MovieCarousel
      title={title || "Movies"}
      movies={movieList}
      isLargeRow={isLargeRow}
    />
  );
};

export default Movies;
