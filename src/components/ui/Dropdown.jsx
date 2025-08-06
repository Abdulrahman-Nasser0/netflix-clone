import React, { useState, useEffect, useRef } from 'react';
import { FaCaretDown } from 'react-icons/fa';

const Dropdown = ({ 
  trigger, 
  children, 
  className = '',
  dropdownClassName = '',
  position = 'right' // 'left' or 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  const positionClass = position === 'left' ? 'left-0' : 'right-0';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center cursor-pointer space-x-2 text-white hover:text-gray-300 transition-colors duration-200"
      >
        {trigger}
        <FaCaretDown className="text-xs" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute ${positionClass} top-12 w-48 bg-black/90 backdrop-blur-sm rounded-md border border-gray-700 py-2 shadow-xl z-50 ${dropdownClassName}`}>
          <div onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Dropdown Item Components for consistency
export const DropdownItem = ({ children, onClick, className = '', ...props }) => (
  <div
    onClick={onClick}
    className={`block px-4 py-2 text-white hover:bg-gray-800 transition-colors duration-200 cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const DropdownHeader = ({ children, className = '' }) => (
  <div className={`px-4 py-2 text-sm text-gray-300 border-b border-gray-700 ${className}`}>
    {children}
  </div>
);

export const DropdownDivider = () => (
  <div className="border-t border-gray-700 my-2"></div>
);

export default Dropdown;
