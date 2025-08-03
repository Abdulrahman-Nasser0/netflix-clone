/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in when app starts
  useEffect(() => {
    const userData = localStorage.getItem('user')
    
    if (userData && userData !== 'undefined') {
      try {
        setUser(JSON.parse(userData))
      } catch {
        localStorage.removeItem('user')
        localStorage.removeItem('auth_token')
      }
    }
    setLoading(false)
  }, [])

  // Simple login function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Save user and token
        if (data.Token) {
          localStorage.setItem('auth_token', data.Token)
        }
        localStorage.setItem('user', JSON.stringify(data.User))
        setUser(data.User)
        
        return { success: true }
      } else {
        return { success: false, error: data.message }
      }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  // Simple register function
  const register = async (userData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: data.message, errors: data.errors }
      }
    } catch {
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  // Improved logout function with better error handling
  const logout = async () => {
    const token = localStorage.getItem('auth_token')
    
    // Always clear local storage first (for better UX)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    setUser(null)
    
    // Try to notify backend (optional)
    if (token) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          console.log('Backend logout successful')
        } else {
          console.log('Backend logout failed, but local logout completed')
        }
      } catch (error) {
        console.log('Backend logout request failed:', error.message)
        // Don't throw error - local logout already completed
      }
    } else {
      console.log('No token found, skipping backend logout')
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
