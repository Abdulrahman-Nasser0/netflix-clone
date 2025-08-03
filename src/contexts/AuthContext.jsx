/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// Fallback API URL if environment variable is not available
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://netflix-clone-production-6036.up.railway.app/api'

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

  // Debug: Check if environment variables are loaded
  useEffect(() => {
    console.log('Environment check:')
    console.log('VITE_BACKEND_API_URL (env):', import.meta.env.VITE_BACKEND_API_URL)
    console.log('API_BASE_URL (with fallback):', API_BASE_URL)
    console.log('Environment mode:', import.meta.env.MODE)
  }, [])

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

  // Simple login function with better error logging
  const login = async (email, password) => {
    try {
      console.log('Attempting login to:', `${API_BASE_URL}/login`)
      
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      console.log('Login response status:', response.status)

      const data = await response.json()

      if (response.ok) {
        if (data.Token) {
          localStorage.setItem('auth_token', data.Token)
        }
        localStorage.setItem('user', JSON.stringify(data.User))
        setUser(data.User)
        
        return { success: true }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      console.error('Login network error:', error)
      return { success: false, error: 'Network error. Please check your connection.' }
    }
  }

  // Simple register function with better error logging
  const register = async (userData) => {
    try {
      console.log('Attempting registration to:', `${API_BASE_URL}/register`)
      
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      console.log('Registration response status:', response.status)

      const data = await response.json()

      if (response.ok) {
        return { success: true }
      } else {
        return { success: false, error: data.message, errors: data.errors }
      }
    } catch (error) {
      console.error('Registration network error:', error)
      return { success: false, error: 'Network error. Please check your connection.' }
    }
  }

  // Logout function
  const logout = async () => {
    const token = localStorage.getItem('auth_token')
    
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    setUser(null)
    
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/logout`, {
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
      }
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
