// searchUtils.js - Utility functions for search and filters

// Build URL search params from filter state
export const buildSearchParams = (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.query) {
    params.set('q', filters.query);
  }
  
  if (filters.genre) {
    params.set('genre', filters.genre);
  }
  
  if (filters.type && filters.type !== 'all') {
    params.set('type', filters.type);
  }
  
  if (filters.year) {
    params.set('year', filters.year);
  }
  
  if (filters.sortBy) {
    params.set('sort', filters.sortBy);
  }
  
  return params;
};

// Parse URL search params into filter state
export const parseSearchParams = (searchParams) => {
  return {
    query: searchParams.get('q') || '',
    genre: searchParams.get('genre') || '',
    type: searchParams.get('type') || 'all',
    year: searchParams.get('year') || '',
    sortBy: searchParams.get('sort') || '',
  };
};

// Get display name for genre ID
export const getGenreNameById = (genreId, genres = []) => {
  if (!genreId) return '';
  const genre = genres.find(g => g.id.toString() === genreId.toString());
  return genre ? genre.name : '';
};

// Format TMDB API response to a consistent format
export const formatSearchResults = (results = [], mediaType = '') => {
  return results.map(item => {
    const type = item.media_type || mediaType || 
      (item.first_air_date ? 'tv' : 'movie');
    
    return {
      ...item,
      media_type: type,
      title: item.title || item.name || 'Untitled',
      year: getYearFromDate(item.release_date || item.first_air_date),
    };
  });
};

// Helper to extract year from date string
export const getYearFromDate = (dateString) => {
  if (!dateString) return '';
  return dateString.split('-')[0];
};

// Available sort options for search results
export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularity (High to Low)' },
  { value: 'popularity.asc', label: 'Popularity (Low to High)' },
  { value: 'vote_average.desc', label: 'Rating (High to Low)' },
  { value: 'vote_average.asc', label: 'Rating (Low to High)' },
  { value: 'primary_release_date.desc', label: 'Release Date (Newest)' },
  { value: 'primary_release_date.asc', label: 'Release Date (Oldest)' },
];

// List of years for year filter
export const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  for (let year = currentYear; year >= 1900; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  
  return years;
};
