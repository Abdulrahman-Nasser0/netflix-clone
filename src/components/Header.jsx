import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaBell, FaCaretDown } from 'react-icons/fa';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBrowseMenu, setShowBrowseMenu] = useState(false);
  const location = useLocation();

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv-shows' },
    { name: 'My List', path: '/my-list' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] h-16 transition-all duration-500 ${
      isScrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-gradient-to-b from-black/70 to-transparent'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-16 h-full">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          {/* Netflix Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="text-red-600 font-bold text-2xl md:text-3xl">
              NETFLIX
            </div>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-white hover:text-gray-300 transition-colors duration-200 text-sm font-medium ${
                  location.pathname === item.path ? 'text-white font-semibold' : 'text-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setShowBrowseMenu(!showBrowseMenu)} className="cursor-pointer text-white hover:text-gray-300 text-sm font-medium flex items-center space-x-1">
              <span>Browse</span>
              <FaCaretDown className="text-xs" />
            </button>
          </div>
        </div>

        {/* Right side - Search, Notifications, User Menu */}
        <div className="flex items-center space-x-4">
          {/* Search Icon */}
          <button className="text-white hover:text-gray-300 transition-colors duration-200">
            <FaSearch className="text-xl" />
          </button>

          {/* Notifications */}
          <button className="text-white hover:text-gray-300 transition-colors duration-200">
            <FaBell className="text-xl" />
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white text-sm font-semibold">U</span>
              </div>
              <FaCaretDown className="text-xs" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-48 bg-black/90 backdrop-blur-sm rounded-md border border-gray-700 py-2 shadow-xl">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => setShowUserMenu(false)}
                >
                  Manage Profiles
                </Link>
                <Link
                  to="/account"
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => setShowUserMenu(false)}
                >
                  Account
                </Link>
                <Link
                  to="/help"
                  className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => setShowUserMenu(false)}
                >
                  Help Center
                </Link>
                <hr className="border-gray-700 my-2" />
                <button
                  className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => setShowUserMenu(false)}
                >
                  Sign out of Netflix
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Shows when browse is clicked */}
      <div className={`md:hidden px-4 pb-4 ${showBrowseMenu ? 'block' : 'hidden'}`}>
        <nav className="flex flex-col space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-white hover:text-gray-300 transition-colors duration-200 text-sm ${
                location.pathname === item.path ? 'font-semibold' : 'text-gray-300'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
