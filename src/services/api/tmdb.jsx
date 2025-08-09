const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const endpoints = {
  // Movies
  fetchTrending: `/trending/all/week?language=en-US`,
  fetchNetflixOriginals: `/discover/tv?with_networks=213`,
  fetchTopRated: `/movie/top_rated?language=en-US`,
  fetchActionMovies: `/discover/movie?with_genres=28`,
  fetchComedyMovies: `/discover/movie?with_genres=35`,
  fetchHorrorMovies: `/discover/movie?with_genres=27`,
  fetchRomanceMovies: `/discover/movie?with_genres=10749`,
  fetchDocumentaries: `/discover/movie?with_genres=99`,
  fetchSciFiMovies: `/discover/movie?with_genres=878`,
  fetchMysteryMovies: `/discover/movie?with_genres=9648`,
  fetchWesternMovies: `/discover/movie?with_genres=37`,
  fetchAnimationMovies: `/discover/movie?with_genres=16`,
  fetchTVMovies: `/discover/movie?with_genres=10770`,
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
  async get(path, params = {}) {
    // Always resolve against the origin and ensure the "/3" API prefix is present
    const origin = "https://api.themoviedb.org";
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const bearer = import.meta.env.VITE_TMDB_BEARER;

    // If neither creds exist, skip network and let caller handle gracefully
    if (!bearer && !apiKey) {
      const err = new Error("TMDB credentials missing (VITE_TMDB_BEARER or VITE_TMDB_API_KEY)");
      err.code = "TMDB_NO_CREDS";
      throw err;
    }

    // Normalize path to include /3 when a relative path or root path is provided
    let normalizedPath = path || "";
    if (/^https?:\/\//i.test(normalizedPath)) {
      // Absolute URL provided; use as-is
      // new URL will handle it directly
    } else {
      if (normalizedPath.startsWith("/3/")) {
        // correct prefix already present
      } else if (normalizedPath.startsWith("/")) {
        normalizedPath = "/3" + normalizedPath; // e.g. "/movie/..." -> "/3/movie/..."
      } else if (normalizedPath.length > 0) {
        normalizedPath = "/3/" + normalizedPath; // e.g. "movie/..." -> "/3/movie/..."
      } else {
        normalizedPath = "/3";
      }
    }

    const url = new URL(normalizedPath, origin);
    const search = new URLSearchParams(params);

    // Only append api_key if no Bearer token is provided
    if (!bearer && apiKey) {
      search.set("api_key", apiKey);
    }
    if (search.toString()) {
      url.search = search.toString();
    }

    const headers = bearer ? { Authorization: `Bearer ${bearer}` } : {};
    const res = await fetch(url.toString(), { headers });

    if (!res.ok) {
      // Keep console clean; throw rich error without logging here
      const text = await res.text().catch(() => "");
      const error = new Error(`TMDB ${res.status}: ${text || res.statusText}`);
      error.status = res.status;
      error.url = url.toString();
      throw error;
    }
    return res.json();
  },

  // Get movie by ID
  getMovieDetails: async (movieId) => {
  return tmdbApi.get(`/movie/${movieId}`, { language: 'en-US' });
  },

  // Get TV show by ID
  getTVDetails: async (tvId) => {
  return tmdbApi.get(`/tv/${tvId}`, { language: 'en-US' });
  },

  // Get movie videos (trailers)
  getMovieVideos: async (movieId) => {
  return tmdbApi.get(`/movie/${movieId}/videos`, { language: 'en-US' });
  },

  // Get similar movies
  getSimilarMovies: async (movieId) => {
  return tmdbApi.get(`/movie/${movieId}/similar`, { language: 'en-US', page: 1 });
  },

  // Search movies
  searchMovies: async (query, page = 1) => {
  return tmdbApi.get(`/search/movie`, { language: 'en-US', query, page });
  },

  // Search multi (movies, tv shows, people)
  searchMulti: async (query, page = 1) => {
  return tmdbApi.get(`/search/multi`, { language: 'en-US', query, page });
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId, page = 1) => {
  return tmdbApi.get(`/discover/movie`, { with_genres: genreId, page });
  },

  // Get all genres
  getGenres: async () => {
  return tmdbApi.get(`/genre/movie/list`, { language: 'en-US' });
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
