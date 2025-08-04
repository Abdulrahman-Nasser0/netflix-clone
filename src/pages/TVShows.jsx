import React from 'react'
import Layout from '../components/Layout'
import MovieCategoryRow from '../components/MovieCategoryRow'
import { endpoints } from '../services/api/tmdb'

const TVShows = () => {
  const tvCategories = [
    { 
      title: "Netflix Originals", 
      endpoint: endpoints.fetchNetflixOriginals,
      isLargeRow: true
    },
    { title: "Trending TV Shows", endpoint: endpoints.fetchTrending },
    { title: "Popular TV Shows", endpoint: `/tv/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US` },
    { title: "Top Rated TV Shows", endpoint: `/tv/top_rated?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US` },
    { title: "Comedy TV Shows", endpoint: `/discover/tv?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=35` },
    { title: "Drama TV Shows", endpoint: `/discover/tv?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=18` },
    { title: "Crime TV Shows", endpoint: `/discover/tv?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=80` },
    { title: "Sci-Fi TV Shows", endpoint: `/discover/tv?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=10765` },
  ];

  return (
    <Layout>
      <div className="mx-auto px-4 sm:px-8 md:px-16 mt-8 py-8">
        {/* Header Section */}
        <div className="px-4 md:px-16 mb-8">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">TV Shows</h1>
          <p className="text-gray-300 text-lg">
            Binge-watch your favorite series and discover new ones
          </p>
        </div>

        {/* TV Show Categories */}
        {tvCategories.map((category, index) => (
          <MovieCategoryRow key={index} category={category} />
        ))}
      </div>
    </Layout>
  )
}

export default TVShows
