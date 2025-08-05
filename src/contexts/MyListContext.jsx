/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const MyListContext = createContext();

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error('useMyList must be used within a MyListProvider');
  }
  return context;
};

// const fetchMovieDetails = async (movieId) => {
//     try {
//       const movieData = await tmdbApi.getMovieDetails(movieId);
//       return {
//         id: movieData.id,
//         title: movieData.title,
//         poster_path: movieData.poster_path
//       };
//     } catch (error) {
//       console.error(`Error fetching movie details for ID ${movieId}:`, error);
//       return null;
//     }
//   };

export const MyListProvider = ({ children }) => {
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  // Manual API base URL
  const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL}`;

  // Get all movies from My List - wrapped in useCallback to fix dependency issue
  const getMyList = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/retrieve`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('My List data:', data);
        
      }
    } catch (error) {
      console.error('Error fetching my list:', error);
      setMyList([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, API_BASE_URL]);

  // Fetch movies when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      getMyList();
    } else {
      setMyList([]);
    }
  }, [isAuthenticated, user, getMyList]);

  // Add movie to My List
  const addToMyList = async (movie) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      // Check if movie is already in My List
      if (myList.some((m) => m.id === movie.id)) {
        return; 
      }

      const response = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          movie_id: movie.id,
        })
      });
      
      if (response.ok) {
        // Add to local state
        // setMyList(prev => [...prev, {
        //   movie_id: movie.id,
        //   title: movie.title || movie.name,
        //   poster_path: movie.poster_path
        // }]);
      }
      
    } catch (error) {
      console.error('Error adding to my list:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    myList,
    loading,
    addToMyList,
    getMyList
  };

  return (
    <MyListContext.Provider value={value}>
      {children}
    </MyListContext.Provider>
  );
};