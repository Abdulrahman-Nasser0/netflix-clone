import React from "react";
import { Link, useLocation } from "react-router-dom";
import Dropdown, { DropdownItem } from "./Dropdown";

const Navigation = ({ className = "" }) => {
  const location = useLocation();
  const navigationItems = [
    { path: "/", label: "Home" },
    { path: "/movies", label: "Movies" },
    { path: "/tv-shows", label: "TV Shows" },
    { path: "/my-list", label: "My List" },
  ];

  return (
    <>
      {/* Mobile Navigation - Hidden on md+ screens */}
      <Dropdown
        trigger="Browse"
        className={`md:hidden ${className}`}
        position="left"
      >
        {navigationItems.map((item) => (
          <DropdownItem key={item.path}>
            <Link
              to={item.path}
              className={`block w-full ${
                location.pathname === item.path
                  ? "font-semibold"
                  : "font-normal"
              }`}
            >
              {item.label}
            </Link>
          </DropdownItem>
        ))}
      </Dropdown>

      {/* Desktop Navigation - Hidden on mobile */}
      <nav className={`hidden md:flex items-center space-x-6 ${className}`}>
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-white hover:text-gray-300 transition-colors duration-200 ${
              location.pathname === item.path ? "font-semibold" : "font-normal"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navigation;
