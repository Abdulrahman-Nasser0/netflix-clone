import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't show on the search page 
  if (location.pathname === '/search') {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsExpanded(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form 
        onSubmit={handleSubmit}
        className={`flex items-center transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-60 md:w-72' : 'w-10'
        }`}
      >
        <button
          type={isExpanded ? 'submit' : 'button'}
          onClick={() => !isExpanded && setIsExpanded(true)}
          className={`absolute ${isExpanded ? 'left-3' : 'left-1'} text-white cursor-pointer z-10`}
          aria-label="Search"
        >
          <FaSearch />
        </button>
        
        <input
          type="text"
          placeholder="Titles, people, genres"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => !searchQuery && setIsExpanded(false)}
          className={`
            bg-black/40 border border-gray-700 rounded-md
            text-white placeholder-gray-400
            pl-10 pr-3 py-1.5 w-full
            focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600
            transition-all duration-300
            ${isExpanded ? 'opacity-100' : 'opacity-0'}
          `}
        />
      </form>
    </div>
  );
};

export default SearchBar;
