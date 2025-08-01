import React from 'react'
import Layout from '../components/Layout'
import MovieCategoryRow from '../components/MovieCategoryRow'
import { endpoints } from '../services/api/tmdb'

const Movies = () => {
  const movieCategories = [
    { title: "Top Rated Movies", endpoint: endpoints.fetchTopRated },
    { title: "Action Movies", endpoint: endpoints.fetchActionMovies },
    { title: "Comedy Movies", endpoint: endpoints.fetchComedyMovies },
    { title: "Horror Movies", endpoint: endpoints.fetchHorrorMovies },
    { title: "Romance Movies", endpoint: endpoints.fetchRomanceMovies },
    { title: "Sci-Fi Movies", endpoint: endpoints.fetchSciFiMovies },
    { title: "Mystery Movies", endpoint: endpoints.fetchMysteryMovies },
    { title: "Western Movies", endpoint: endpoints.fetchWesternMovies },
    { title: "Animation Movies", endpoint: endpoints.fetchAnimationMovies },
    { title: "Documentaries", endpoint: endpoints.fetchDocumentaries },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="px-4 md:px-16 mb-8">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">Movies</h1>
          <p className="text-gray-300 text-lg">
            Discover thousands of movies across all genres
          </p>
        </div>

        {/* Movie Categories */}
        {movieCategories.map((category, index) => (
          <MovieCategoryRow key={index} category={category} />
        ))}
      </div>
    </Layout>
  )
}

export default Movies
