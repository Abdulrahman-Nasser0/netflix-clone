import React, { useState, useRef, useEffect } from 'react'
import { IoMdArrowDropdown } from "react-icons/io";
import { IoLanguage } from "react-icons/io5";

const LanguageDropdown = ({ 
  selectedLanguage = 'English',
  onLanguageChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageSelect = (language) => {
    if (onLanguageChange) {
      onLanguageChange(language)
    }
    setIsOpen(false)
  }


  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex cursor-pointer
          items-center
          bg-black/70
          border 
          border-gray-600
          hover:border-white
          text-white
          px-[.8rem]
          py-[.3rem] 
          rounded
          transition-all
          duration-200
          backdrop-blur-sm
          gap-1
          justify-between
        "
      >
        <IoLanguage className="text-lg " />
        <IoMdArrowDropdown className="text-sm " />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="
          absolute
        
          top-full
          left-0
          mt-1
          w-full
          bg-black/90
          backdrop-blur-sm
          border
          border-gray-600
          rounded
          shadow-xl
          z-50
          max-h-60
          overflow-y-auto
        ">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              className={`
                w-full cursor-pointer
                text-center
                py-3
                text-[.7rem] 
                text-white
                hover:bg-gray-800
                transition-colors
                duration-200
                flex
                items-center
                justify-center
                ${selectedLanguage === language.name ? 'bg-gray-800' : ''}
              `}
            >
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageDropdown
