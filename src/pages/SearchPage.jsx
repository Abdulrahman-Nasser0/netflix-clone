import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import MovieCard from '../components/ui/MovieCard';
import SearchFilters from '../components/ui/SearchFilters';
import { tmdbApi, GENRES } from '../services/api/tmdb';
import { useInView } from 'react-intersection-observer';
import { FaSpinner, FaSearch } from 'react-icons/fa';
import { formatSearchResults, getGenreNameById } from '../utils/searchUtils';
import MovieModal from '../components/ui/MovieModal';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

  const filters = {
    query: searchParams.get('q') || '',
    genre: searchParams.get('genre') || '',
    type: searchParams.get('type') || 'all',
    year: searchParams.get('year') || '',
    sortBy: searchParams.get('sort') || '',
  };
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [genres, setGenres] = useState([]);

  // load more when this ref comes into view
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // initialize search input from URL params
  useEffect(() => {
    setSearchInput(filters.query);
  }, [filters.query]);

  // load genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await tmdbApi.getGenres();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    
    fetchGenres();
  }, []);

  // reset results when search params change
  useEffect(() => {
    setResults([]);
    setPage(1);
    setTotalPages(0);
  }, [filters.query, filters.genre, filters.type, filters.year, filters.sortBy]);

  // load results when page or search params change
  useEffect(() => {
    const fetchResults = async () => {
      // skip if no search criteria
      if (!filters.query && !filters.genre && !filters.year) return;
      
      setLoading(true);
      setError(null);
      
      try {
        let data;
        const params = {
          page,
          language: 'en-US',
        };
        
        // Add year filter if specified
        if (filters.year) {
          params.primary_release_year = filters.year;
        }
        
        // Add sort parameter if specified
        if (filters.sortBy) {
          params.sort_by = filters.sortBy;
        }
        
        // Case 1: Search with query
        if (filters.query) {
          if (filters.type === 'movie') {
            data = await tmdbApi.searchMovies(filters.query, page);
          } else if (filters.type === 'tv') {
            data = await tmdbApi.get('/search/tv', { query: filters.query, page });
          } else {
            data = await tmdbApi.searchMulti(filters.query, page);
            // Filter out person results
            if (data.results) {
              data.results = data.results.filter(item => 
                item.media_type !== 'person'
              );
            }
          }
        } 
        // Case 2: Filter by genre and other criteria
        else if (filters.genre || filters.year) {
          // Choose endpoint based on media type
          const endpoint = filters.type === 'tv' ? '/discover/tv' : '/discover/movie';
          
          // Add genre filter if specified
          if (filters.genre) {
            params.with_genres = filters.genre;
          }
          
          data = await tmdbApi.get(endpoint, params);
        }

        if (data && data.results) {
          // Format results to consistent structure
          const formattedResults = formatSearchResults(data.results, filters.type);
          
          // append new results if we are paginating, otherwise replace
          setResults(prev => 
            page > 1 ? [...prev, ...formattedResults] : formattedResults
          );
          setTotalPages(data.total_pages || 0);
        }
      } catch (err) {
        setError('Failed to load search results. Please try again.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [filters.query, filters.genre, filters.type, filters.year, filters.sortBy, page]);

  // load more results when scroll 
  useEffect(() => {
    if (inView && !loading && page < totalPages) {
      setPage(prev => prev + 1);
    }
  }, [inView, loading, page, totalPages]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    const newParams = new URLSearchParams(searchParams);
    
    if (searchInput.trim()) {
      newParams.set('q', searchInput.trim());
    } else {
      newParams.delete('q');
    }
    
    setSearchParams(newParams);
  };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    
    setSearchParams(newParams);
  };

  // clear filters
  const handleClearFilters = () => {
    setSearchParams(filters.query ? { q: filters.query } : {});
  };

  const getResultsTitle = () => {
    if (filters.query) {
      return `Search results for "${filters.query}"`;
    } else if (filters.genre) {
      return `${getGenreNameById(filters.genre, genres)} ${filters.type === 'tv' ? 'TV Shows' : 'Movies'}`;
    } else if (filters.year) {
      return `${filters.year} ${filters.type === 'tv' ? 'TV Shows' : 'Movies'}`;
    }
    return 'Browse all';
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    console.log('Selected movie/show:', movie);
  };

  return (
    <Layout>
      <div className="px-4 md:px-16 py-6">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for movies or TV shows"
              className="w-full bg-gray-800 text-white rounded-md pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <FaSearch className="text-xl" />
            </button>
          </form>
        </div>

        <h1 className="text-white text-2xl md:text-3xl font-bold mb-6">
          {getResultsTitle()}
        </h1>

        {/* Advanced Filters */}
        <SearchFilters 
          genres={genres}
          currentFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Results Grid */}
        {error ? (
          <div className="text-red-500 py-4">{error}</div>
        ) : results.length > 0 ? (
          <>
            {/* Netflix-style responsive grid with proper spacing */}
            <div className="grid grid-cols-2  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-2 gap-y-10 md:gap-y-14 mx-auto ">
              {results.map((item, index) => (
                <div 
                  key={`${item.id}-${index}`}
                >
                  <MovieCard 
                    movie={item} 
                    mediaType={item.media_type || (filters.type === 'all' ? 'movie' : filters.type)} 
                    onMovieClick={handleMovieClick}
                    className="w-full h-full"
                    responsive={true}
                  />
                </div>
              ))}
            </div>
            
            {/* Load more indicator */}
            <div 
              ref={ref} 
              className="py-8 flex justify-center"
            >
              {loading && (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin text-red-600 text-2xl mr-2" />
                  <span className="text-white">Loading more...</span>
                </div>
              )}
            </div>
          </>
        ) : !loading ? (
          <div className="text-gray-400 py-8 text-center">
            {(filters.query || filters.genre || filters.year) ? 'No results found' : 'Enter a search term or select filters to find movies and TV shows'}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-red-600 text-3xl mr-2" />
            <span className="text-white text-xl">Loading...</span>
          </div>
        )}
      </div>
      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </Layout>
  );
};

export default SearchPage;
