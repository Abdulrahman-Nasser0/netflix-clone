import Layout from '../components/Layout'
import MovieCategoryRow from '../components/MovieCategoryRow'
import { movieCategories } from '../services/api/tmdb'

const Home = () => {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="px-4 md:px-16 mb-8">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
            Unlimited movies, TV shows, and more.
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl">
            Watch anywhere. Cancel anytime.
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

export default Home