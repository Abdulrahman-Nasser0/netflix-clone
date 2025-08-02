import React from 'react'
import Layout from '../components/Layout'

const MyList = () => {
  return (
    <Layout>
      <div className="px-4 md:px-16">
        <h1 className="text-white text-3xl font-bold mb-8">My List</h1>
        <div className="text-white">
          <p className="text-gray-300">Your favorite movies and TV shows will appear here.</p>
          <p className="text-gray-300 mt-4">Start adding content to your list to see it here!</p>
        </div>
      </div>
    </Layout>
  )
}

export default MyList
