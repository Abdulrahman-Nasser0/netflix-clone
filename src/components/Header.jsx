import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import LanguageDropdown from './ui/LanguageDropdown';
import Logo from './ui/Logo';
const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Check if we're on authentication pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Logout handler with backend call
  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  // Handle scroll effect for header background

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
    };

    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  return (
    <header className={`absolute top-0 left-0 right-0 z-[100] h-16 transition-all duration-500 bg-gradient-to-b from-black/70 to-transparent
      
   `}>
      <div className="flex items-center justify-between px-4 md:px-16 h-full">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Netflix Logo */}
          <Logo/>

          {/* Navigation Menu - Show only for authenticated users */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`text-white hover:text-gray-300 transition-colors duration-200 ${
                  location.pathname === '/' ? 'font-semibold' : 'font-normal'
                }`}
              >
                Home
              </Link>
              <Link
                to="/movies"
                className={`text-white hover:text-gray-300 transition-colors duration-200 ${
                  location.pathname === '/movies' ? 'font-semibold' : 'font-normal'
                }`}
              >
                Movies
              </Link>
              <Link
                to="/tv-shows"
                className={`text-white hover:text-gray-300 transition-colors duration-200 ${
                  location.pathname === '/tv-shows' ? 'font-semibold' : 'font-normal'
                }`}
              >
                TV Shows
              </Link>
              <Link
                to="/my-list"
                className={`text-white hover:text-gray-300 transition-colors duration-200 ${
                  location.pathname === '/my-list' ? 'font-semibold' : 'font-normal'
                }`}
              >
                My List
              </Link>
            </nav>
          )}
        </div>

        {/* Right side - Language, Auth buttons or User menu */}
        <div className="flex items-center space-x-4">
          {/* Language Dropdown - Show only for guests */}
          {!isAuthenticated && !isAuthPage && (
            <LanguageDropdown
              selectedLanguage={selectedLanguage}
              onLanguageChange={(language) => setSelectedLanguage(language.name)}
            />
          )}

          {isAuthenticated ? (
            // Show user menu when authenticated
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
                className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <FaCaretDown className="text-xs" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-48 bg-black/90 backdrop-blur-sm rounded-md border border-gray-700 py-2 shadow-xl">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                    {user?.name}
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Manage Profile
                  </Link>
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Account
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    Sign out of Netflix
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Show Sign In button only when not authenticated and not on auth pages
            !isAuthPage && (
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
