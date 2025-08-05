import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useMyList } from "../contexts/MyListContext";
import MovieCarousel from "../components/MovieCarousel";
import { tmdbApi } from "../services/api/tmdb";

const MyList = () => {
  const { myList, loading, fetchMyList } = useMyList();
  const [myListDetails, setMyListDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // Fetch full details for each favorite from TMDB
  const fetchDetails = async () => {
    if (!myList || !Array.isArray(myList)) {
      console.log('myList is not ready:', myList);
      setMyListDetails([]);
      return;
    }

    setDetailsLoading(true);
    setDetailsError(null);
    try {
      // Fetch details for all favorites concurrently
      const detailPromises = myList.map(async (favorite) => {
        try {
          // Try to fetch with the correct media type first
          let endpoint = favorite.mediaType === "tv"
            ? `/tv/${favorite.tmdbId}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
            : `/movie/${favorite.tmdbId}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`;

          let response = await tmdbApi.get(endpoint);
          
          return {
            ...response,
            favoriteId: favorite.id,
            mediaType: favorite.mediaType,
          };
        } catch (error) {
          // If the first request fails, try the opposite media type
          try {
            const alternateMediaType = favorite.mediaType === "tv" ? "movie" : "tv";
            const alternateEndpoint = alternateMediaType === "tv"
              ? `/tv/${favorite.tmdbId}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
              : `/movie/${favorite.tmdbId}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`;

            console.log(`Trying alternate media type ${alternateMediaType} for ID ${favorite.tmdbId}`);
            const alternateResponse = await tmdbApi.get(alternateEndpoint);
            
            return {
              ...alternateResponse,
              favoriteId: favorite.id,
              mediaType: alternateMediaType, // Update with the correct media type
            };
          } catch (alternateError) {
            console.error(
              `Error fetching details for both media types of ID ${favorite.tmdbId}:`,
              error.message,
              alternateError.message
            );
            
            // Return a fallback object instead of null
            return {
              id: favorite.tmdbId,
              title: favorite.mediaType === "movie" ? `Unknown Movie (ID: ${favorite.tmdbId})` : undefined,
              name: favorite.mediaType === "tv" ? `Unknown TV Show (ID: ${favorite.tmdbId})` : undefined,
              poster_path: null,
              favoriteId: favorite.id,
              mediaType: favorite.mediaType,
              addedAt: favorite.addedAt,
              error: true,
            };
          }
        }
      });

      const details = await Promise.all(detailPromises);
      // Filter out any null/undefined results but keep error objects
      setMyListDetails(details.filter(Boolean));
    } catch (error) {
      console.error("Error fetching favorite details:", error);
      setDetailsError("Failed to load favorite details");
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [myList]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto px-4 sm:px-8 md:px-16 mt-8 py-8">
          <div className="px-4 md:px-16 mb-8">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
              My List
            </h1>
            <div className="flex items-center justify-center py-20">
              <p className="text-lg">Loading your favorites...</p>
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="mx-auto px-4 sm:px-8 md:px-16 mt-8 py-8">
        <div className="px-4 md:px-16 mb-8">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
            My List ({myList.length})
          </h1>

          {detailsError && (
            <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-500 rounded-lg">
              <p className="text-yellow-200">{detailsError}</p>
              <button
                onClick={() => setDetailsError(null)}
                className="mt-2 text-sm text-yellow-300 hover:text-yellow-100 underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {myList.length === 0 ? (
            // Empty state
            <div className="text-center py-20">
              <p className="text-gray-300 text-lg mb-6">
                Start adding content to your list to see it here!
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-semibold"
              >
                Browse Movies
              </button>
            </div>
          ) : (
            // Movies grid
            <>
              {detailsLoading && (
                <div className="mb-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                    <p className="text-gray-300">Loading movie details...</p>
                  </div>
                </div>
              )}
              <MovieCarousel movies={myListDetails} />
            </>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={fetchMyList}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded font-medium"
            >
              Refresh List
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyList;
