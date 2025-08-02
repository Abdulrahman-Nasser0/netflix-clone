import React from 'react'
import Layout from '../components/Layout'

const Home = () => {
  return (
    <Layout>
      <div className="px-4 md:px-16">
        <h1 className="text-white text-3xl font-bold mb-8">Welcome to Netflix</h1>
        <div className="text-white">
          <p className="text-gray-300 bg-red-600 p-4">Your home for entertainment starts here.</p>
        </div>
      </div>
    </Layout>
  )
}

export default Home