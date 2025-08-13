import React, { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';
import { SORT_OPTIONS, getYearOptions } from '../../utils/searchUtils';

const SearchFilters = ({ 
  genres = [], 
  currentFilters = {}, 
  onFilterChange,
  onClearFilters 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const yearOptions = getYearOptions();

  const handleChange = (key, value) => {
    onFilterChange(key, value);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <button 
          className="flex items-center text-gray-300 hover:text-white cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <FaFilter className="mr-2" />
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        {Object.values(currentFilters).some(value => value) && (
          <button 
            className="flex items-center cursor-pointer text-gray-300 hover:text-white text-sm"
            onClick={onClearFilters}
          >
            <FaTimes className="mr-1" />
            Clear Filters
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="bg-gray-900/80 rounded-md p-4 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Genre
              </label>
              <select 
                value={currentFilters.genre || ''}
                onChange={(e) => handleChange('genre', e.target.value)}
                className="bg-gray-800 no-scrollbar text-white rounded px-3 py-2 w-full focus:ring-1 focus:ring-red-600 focus:outline-none"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Type
              </label>
              <select 
                value={currentFilters.type || 'all'}
                onChange={(e) => handleChange('type', e.target.value)}
                className="bg-gray-800 no-scrollbar text-white rounded px-3 py-2 w-full focus:ring-1 focus:ring-red-600 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Year
              </label>
              <select 
                value={currentFilters.year || ''}
                onChange={(e) => handleChange('year', e.target.value)}
                className="bg-gray-800 no-scrollbar text-white rounded px-3 py-2 w-full focus:ring-1 focus:ring-red-600 focus:outline-none"
              >
                <option value="">All Years</option>
                {yearOptions.slice(0, 50).map(year => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By Filter */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Sort By
              </label>
              <select 
                value={currentFilters.sortBy || ''}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                className="bg-gray-800 no-scrollbar text-white rounded px-3 py-2 w-full focus:ring-1 focus:ring-red-600 focus:outline-none"
              >
                <option value="">Default</option>
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
