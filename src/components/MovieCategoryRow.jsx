import { useState, useEffect } from "react";
import { tmdbApi } from "../services/api/tmdb";
import MovieCarousel from "./MovieCarousel";

const MovieCategoryRow = ({ category, onMovieClick }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        // category.endpoint may be a full endpoint string like "/discover/movie?..."
        // Support both: if it contains a query string, split and pass as params; else pass path only
        let path = category.endpoint;
        let params = {};
        if (typeof path === "string" && path.includes("?")) {
          const [p, q] = path.split("?");
          path = p;
          const usp = new URLSearchParams(q);
          usp.forEach((v, k) => { params[k] = v; });
        }
        const data = await tmdbApi.get(path, params);
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
                <div
                  className={`bg-gray-700 rounded-lg animate-pulse
                  }`}
                ></div>
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
      onMovieClick={onMovieClick}
    />
  );
};



export default MovieCategoryRow;
