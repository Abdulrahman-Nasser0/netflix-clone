import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

const ErrorPage = () => {
  return (
    <Layout>
      <div className="px-4 md:px-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-white text-6xl font-bold mb-4">404</h1>
          <h2 className="text-white text-2xl mb-4">Page Not Found</h2>
          <p className="text-gray-300 mb-8 max-w-md">
              Sorry, we couldn't find the page you're looking for. 
              The content you're looking for might have been removed or is temporarily unavailable.
          </p>
          <Link 
              to='/' 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded transition-colors duration-200 font-semibold"
          >
              Go to Home
          </Link>
      </div>
    </Layout>
  )
}

export default ErrorPage