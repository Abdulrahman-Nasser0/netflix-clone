import React from "react";
import Layout from "../components/Layout";
import { useMyList } from "../contexts/MyListContext";
import MovieCarousel from "../components/MovieCarousel";
const MyList = () => {
  const { myList, loading, getMyList } = useMyList();
  if (loading) {
    return (
      <Layout>
        <div className="mx-auto px-4 sm:px-8 md:px-16 mt-8 py-8">
          <div className="px-4 md:px-16 mb-8">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
              My List
            </h1>
            <div className="flex items-center justify-center py-20">
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
            <MovieCarousel movies={myList} />
          )}

          <div className="mt-12 text-center">
            <button
              onClick={getMyList}
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
