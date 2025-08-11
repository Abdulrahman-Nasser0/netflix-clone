import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

const ComingSoonPage = () => {
  return (
    <Layout>
      <div className="px-4 md:px-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 className="text-white text-2xl mb-12">Feature Coming Soon...</h2>
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

export default ComingSoonPage