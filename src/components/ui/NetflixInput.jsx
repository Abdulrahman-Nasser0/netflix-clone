import React, { useState } from 'react'

const NetflixInput = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  error = false,
  errorMessage = '',
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value && value.length > 0

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full
          h-[3.2rem]
          px-4
          pt-6
          pb-2
          bg-black/70
          border
          ${error ? 'border-red-500' : isFocused ? 'border-white' : 'border-gray-600'}
          rounded
          text-white
          focus:outline-none
          backdrop-blur-sm
        `}
        placeholder=""
        {...props}
      />

      {/* Floating Label/Placeholder */}
      <label
        className={`
          absolute
          left-4
          text-gray-400
          pointer-events-none
          transition-all
          duration-200
          ease-in-out
          ${
            isFocused || hasValue
              ? 'top-2 text-xs text-gray-400'
              : 'top-1/2 -translate-y-1/2 text-base'
          }
        `}
      >
        {placeholder}
      </label>

      {/* Error Message - Absolutely positioned */}
      {error && errorMessage && (
        <div className="absolute top-full left-0 mt-1 text-red-500 text-sm z-10 bg-black/80 px-2 py-1 rounded whitespace-nowrap">
          {errorMessage}
        </div>
      )}
    </div>
  )
}

export default NetflixInput
