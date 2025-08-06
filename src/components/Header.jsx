import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LanguageDropdown from "./ui/LanguageDropdown";
import Logo from "./ui/Logo";
import Dropdown, { DropdownItem, DropdownHeader } from "./ui/Dropdown";
import Navigation from "./ui/Navigation";
import { useState } from "react";
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  // Logout handler with backend call
  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };


  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50  h-16">
        <div className="flex items-center justify-between px-4 md:px-16 h-full">
          <Logo />
          <div className="w-8 h-8 bg-gray-600 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`absolute top-0 left-0 right-0 z-400 h-16 bg-gradient-to-b from-black/70 to-transparent
   `}
    >
      <div className="flex items-center justify-between px-4 md:px-16 h-full">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-4 md:space-x-8">
          {/* Netflix Logo */}
          <Logo />

          {/* Navigation Menu - Show only for authenticated users */}
          {isAuthenticated && <Navigation />}
        </div>

        {/* Right side - Language, Auth buttons or User menu */}
        <div className="flex items-center space-x-4">
          {/* Language Dropdown - Show only for guests */}
          {!isAuthenticated && !isAuthPage && (
            <LanguageDropdown/>
          )}

          {isAuthenticated ? (
            // Show user menu when authenticated
            <Dropdown
              trigger={
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
              }
              position="right"
            >
              <DropdownHeader>{user?.name}</DropdownHeader>
              <DropdownItem>
                <Link to="/profile">Manage Profile</Link>
              </DropdownItem>
              <DropdownItem>
                <Link to="/account">Account</Link>
              </DropdownItem>
              <DropdownItem onClick={handleLogout}>
                Sign out of Netflix
              </DropdownItem>
            </Dropdown>
          ) : (
            // Show Sign In button when not authenticated and not on auth pages
            !isAuthPage && (
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-[.3rem] rounded text-sm font-medium transition-colors duration-200"
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
