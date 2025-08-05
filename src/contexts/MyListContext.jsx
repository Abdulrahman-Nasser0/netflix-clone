/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const MyListContext = createContext();

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("useMyList must be used within a MyListProvider");
  }
  return context;
};

export const MyListProvider = ({ children }) => {
  const [myList, setMyList] = useState(new Set());
  // For deletion
  const [myListMetaData, setMyListMetaData] = useState(new Map());

  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  // base URL
  const API_BASE_URL = `${import.meta.env.VITE_BACKEND_API_URL}`;

  // Helper function to create unique key for items
  const createItemKey = (tmdbId, mediaType) => `${mediaType}-${tmdbId}`;


  const getMyListArray = () => {
    return Array.from(myList).map(key => {
      const metadata = myListMetaData.get(key);
      return {
        id: key,
        tmdbId: metadata?.tmdbId,
        mediaType: metadata?.mediaType,
        addedAt: metadata?.addedAt
      };
    }).filter(item => item.tmdbId); // Filter out items without valid metadata
  };


  // Get Movies/Tv Shows from My List - wrapped in useCallback to fix dependency issue
  const fetchMyList = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setMyList(new Set());
      setMyListMetaData(new Map());
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/retrieve`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const favorites = data.favorites || [];

      // Create a Set for unique items and a Map for metadata
      const newMyListIds = new Set();
      const metadata = new Map();

      favorites.forEach((fav) => {
        const key = createItemKey(fav.tmdb_id, fav.media_type);
        newMyListIds.add(key);
        metadata.set(key, {
          tmdbId: parseInt(fav.tmdb_id),
          mediaType: fav.media_type,
        });
      });

      setMyList(newMyListIds);
      setMyListMetaData(metadata);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setMyList(new Set());
      setMyListMetaData(new Map());
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, API_BASE_URL]);


  // Add movie/tv show to My List
  const addToMyList = async ({tmdbId, mediaType = 'movie'}) => {
    console.log('addToMyList called with:', { tmdbId, mediaType });

    if (!isAuthenticated) {
      throw new Error("Must be authenticated to add to My List");
    }

    const itemKey = createItemKey(tmdbId, mediaType);
    console.log('Generated itemKey:', itemKey);

    if (myList.has(itemKey)) {
      console.log('Item already in list');
      return { success: true, message: "Already in My List" };
    }

    try {
      setLoading(true);
      console.log('Starting optimistic update...');

      setMyList((prev) => new Set([...prev, itemKey]));
      setMyListMetaData((prev) => new Map([
        ...prev,
        [itemKey, {
          tmdbId,
          mediaType
        }]
      ]));

      console.log('Making API call to:', `${API_BASE_URL}/add`);
      const response = await fetch(`${API_BASE_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          tmdb_id: tmdbId.toString(),
          media_type: mediaType,
        }),
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        
        // Rollback local state if API call fails
        setMyList((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemKey);
          return newSet;
        });
        setMyListMetaData((prev) => {
          const newMap = new Map(prev);
          newMap.delete(itemKey);
          return newMap;
        });

        throw new Error(`HTTP error! Prev state restored, status: ${response.status}, message: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('API success response:', responseData);

      setMyListMetaData((prev) => new Map([
        ...prev,
        [itemKey, {
          tmdbId,
          mediaType,
        }]
      ]));
      
      console.log('Successfully added to My List');
      return { success: true, message: "Added to My List" };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      
      // Rollback optimistic update on error
      setMyList((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
      setMyListMetaData((prev) => {
        const newMap = new Map(prev);
        newMap.delete(itemKey);
        return newMap;
      });
      
      throw error;
    } finally {
      setLoading(false);
    }

  };

  // Remove movie/tv show from My List
  const removeFromMyList = async ({tmdbId, mediaType = 'movie'}) => {
    console.log('removeFromMyList called with:', { tmdbId, mediaType });

    if (!isAuthenticated) {
      throw new Error("Must be authenticated to remove from My List");
    }

    const itemKey = createItemKey(tmdbId, mediaType);
    console.log('Generated itemKey for removal:', itemKey);

    if (!myList.has(itemKey)) {
      console.log('Item not in list');
      return { success: true, message: "Not in My List" };
    }

    try {
      setLoading(true);
      console.log('Starting optimistic update for removal...');

      // Optimistic update - remove from local state first
      setMyList((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
      setMyListMetaData((prev) => {
        const newMap = new Map(prev);
        newMap.delete(itemKey);
        return newMap;
      });

      console.log('Making API call to:', `${API_BASE_URL}/delete`);
      const response = await fetch(`${API_BASE_URL}/delete/${tmdbId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          tmdb_id: tmdbId.toString(),
          media_type: mediaType,
        }),
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        
        // Rollback local state if API call fails
        setMyList((prev) => new Set([...prev, itemKey]));
        setMyListMetaData((prev) => new Map([
          ...prev,
          [itemKey, {
            tmdbId,
            mediaType
          }]
        ]));

        throw new Error(`HTTP error! Previous state restored, status: ${response.status}, message: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('API success response:', responseData);
      
      console.log('Successfully removed from My List');
      return { success: true, message: "Removed from My List" };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      
      // Rollback optimistic update on error
      setMyList((prev) => new Set([...prev, itemKey]));
      setMyListMetaData((prev) => new Map([
        ...prev,
        [itemKey, {
          tmdbId,
          mediaType
        }]
      ]));
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if item is in My List
  const isInMyList = (tmdbId, mediaType = 'movie') => {
    const itemKey = createItemKey(tmdbId, mediaType);
    return myList.has(itemKey);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMyList();
    } else {
      setMyList(new Set());
      setMyListMetaData(new Map());
    }
  }, [isAuthenticated, user, fetchMyList]);

  const value = {
    myList: getMyListArray(),
    loading,
    addToMyList,
    removeFromMyList,
    isInMyList,
    fetchMyList,
  };

  return (
    <MyListContext.Provider value={value}>{children}</MyListContext.Provider>
  );
};



