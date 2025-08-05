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

  const login = async (email, password) => {
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_API_URL || 'https://netflix-clone-production-72c4.up.railway.app/api'
      console.log('Attempting login to:', `${apiUrl}/login`)
      
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const text = await response.text()
        console.log('Login error response text:', text)
        
        try {
          const data = JSON.parse(text)
          console.log('Login error data:', data)
          return { success: false, error: data.message || 'Login failed' }
        } catch (parseError) {
          console.log('Failed to parse login error response:', parseError)
          return { success: false, error: `Login failed with status: ${response.status}` }
        }
      }

      const data = await response.json()
      console.log('Login success data:', data)

      // Save user and token
      if (data.Token) {
        localStorage.setItem('auth_token', data.Token)
      }
      localStorage.setItem('user', JSON.stringify(data.User))
      setUser(data.User)
      
      return { success: true }
      
    } catch (error) {
      console.error('Login network error:', error)
      
      if (error.message.includes('CORS')) {
        return { success: false, error: 'CORS error: Backend not configured to accept requests from this domain.' }
      } else if (error.message.includes('Failed to fetch')) {
        return { success: false, error: 'Network error: Unable to connect to server. Check if backend is running and CORS is configured.' }
      }
      
      return { success: false, error: `Network error: ${error.message}` }
    }
  }

  const register = async (userData) => {
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_API_URL || 'https://netflix-clone-production-72c4.up.railway.app/api'
      console.log('Attempting registration to:', `${apiUrl}/register`)
      
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      })

      // Check if we were redirected to a different URL (frontend URL)
      if (response.url && response.url.includes('netlify.app')) {
        console.error('Request was redirected to frontend URL:', response.url)
        return { success: false, error: 'API endpoint redirected unexpectedly. Please check backend configuration.' }
      }

      if (!response.ok) {
        // Try to get response body even for non-ok responses
        const text = await response.text()
        console.log('Registration error response text:', text)
        
        try {
          const data = JSON.parse(text)
          console.log('Registration error data:', data)
          return { success: false, error: data.message || 'Registration failed', errors: data.errors }
        } catch (parseError) {
          console.log('Failed to parse error response:', parseError)
          return { success: false, error: `Registration failed with status: ${response.status}` }
        }
      }

      const data = await response.json()
      console.log('Registration success data:', data)
      return { success: true }
      
    } catch (error) {
      console.error('Registration network error:', error)
      
      // More specific error messages
      if (error.message.includes('CORS')) {
        return { success: false, error: 'CORS error: Backend not configured to accept requests from this domain.' }
      } else if (error.message.includes('Failed to fetch')) {
        return { success: false, error: 'Network error: Unable to connect to server. Check if backend is running and CORS is configured.' }
      }
      
      return { success: false, error: `Network error: ${error.message}` }
    }
  }

  const logout = async () => {
    const token = localStorage.getItem('auth_token')
    
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    setUser(null)
    
    // notify backend (optional)
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
