import React from 'react'
import Layout from '../components/Layout'

const Movies = () => {
  return (
    <Layout>
      <div className="px-4 md:px-16">
        <h1 className="text-white text-3xl font-bold mb-8">Movies</h1>
        <div className="text-white">
          <p className="text-gray-300">Movies content will be displayed here.</p>
        </div>
      </div>
    </Layout>
  )
}

export default Movies
