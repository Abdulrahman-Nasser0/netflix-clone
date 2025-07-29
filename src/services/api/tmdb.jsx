const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const endpoints = {
  // Movies
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  fetchTopRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  fetchSciFiMovies: `/discover/movie?api_key=${API_KEY}&with_genres=878`,
  fetchMysteryMovies: `/discover/movie?api_key=${API_KEY}&with_genres=9648`,
  fetchWesternMovies: `/discover/movie?api_key=${API_KEY}&with_genres=37`,
  fetchAnimationMovies: `/discover/movie?api_key=${API_KEY}&with_genres=16`,
  fetchTVMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10770`,
};

// Helper function to construct image URLs
export const getImageUrl = (path, size = "original") => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Image size options
export const IMAGE_SIZES = {
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    original: "original",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
};

// Main API object with all methods
export const tmdbApi = {
  // Generic GET request
  get: async (endpoint) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  // Get movie by ID
  getMovieDetails: async (movieId) => {
    const endpoint = `/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
    return tmdbApi.get(endpoint);
  },

  // Get TV show by ID
  getTVDetails: async (tvId) => {
    const endpoint = `/tv/${tvId}?api_key=${API_KEY}&language=en-US`;
    return tmdbApi.get(endpoint);
  },

  // Get movie videos (trailers)
  getMovieVideos: async (movieId) => {
    const endpoint = `/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`;
    return tmdbApi.get(endpoint);
  },

  // Get similar movies
  getSimilarMovies: async (movieId) => {
    const endpoint = `/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`;
    return tmdbApi.get(endpoint);
  },

  // Search movies
  searchMovies: async (query, page = 1) => {
    const endpoint = `/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
      query
    )}&page=${page}`;
    return tmdbApi.get(endpoint);
  },

  // Search multi (movies, tv shows, people)
  searchMulti: async (query, page = 1) => {
    const endpoint = `/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
      query
    )}&page=${page}`;
    return tmdbApi.get(endpoint);
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId, page = 1) => {
    const endpoint = `/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;
    return tmdbApi.get(endpoint);
  },

  // Get all genres
  getGenres: async () => {
    const endpoint = `/genre/movie/list?api_key=${API_KEY}&language=en-US`;
    return tmdbApi.get(endpoint);
  },
};

// Genre IDs for reference
export const GENRES = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  sciFi: 878,
  tvMovie: 10770,
  thriller: 53,
  war: 10752,
  western: 37,
};

// Export all endpoints as an array for easy iteration
export const movieCategories = [
  {
    title: "NETFLIX ORIGINALS",
    endpoint: endpoints.fetchNetflixOriginals,
    isLargeRow: true,
  },
  { title: "Trending Now", endpoint: endpoints.fetchTrending },
  { title: "Top Rated", endpoint: endpoints.fetchTopRated },
  { title: "Action Movies", endpoint: endpoints.fetchActionMovies },
  { title: "Comedy Movies", endpoint: endpoints.fetchComedyMovies },
  { title: "Horror Movies", endpoint: endpoints.fetchHorrorMovies },
  { title: "Romance Movies", endpoint: endpoints.fetchRomanceMovies },
  { title: "Documentaries", endpoint: endpoints.fetchDocumentaries },
];

// Error messages
export const API_ERRORS = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  INVALID_API_KEY: "Invalid API key. Please check your configuration.",
};

// Default/Fallback images
export const FALLBACK_IMAGES = {
  poster: "/path/to/default-poster.jpg",
  backdrop: "/path/to/default-backdrop.jpg",
  profile: "/path/to/default-profile.jpg",
};
