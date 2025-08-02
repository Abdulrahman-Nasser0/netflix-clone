import { useEffect, useState } from 'react'
import { tmdbApi, endpoints } from '../services/api/tmdb';
import Layout from './Layout';



const Movies = () => {
    const [movieList, setMovieList] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {

                const data = await tmdbApi.get(endpoints.fetchNetflixOriginals);

                setMovieList(data.results);
            } catch (error) {
                console.error('Failed to fetch movies:', error);
                setError('Failed to fetch movies');
            }finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="text-center text-lg font-bold mt-10 text-white">Loading...</div>
            </Layout>
        );
    }
    if (error) {
        return (
            <Layout>
                <div className="text-center text-lg font-bold mt-10 text-white">Something went wrong! Please try again.</div>
            </Layout>
        );
    }
    if (!movieList.length) {
        return (
            <Layout>
                <div className="text-center text-lg font-bold mt-10 text-white">No movies found</div>
            </Layout>
        );
    }
    
    return (
    <Layout>
        <div className="px-4 md:px-16">
            <h1 className="text-white text-2xl font-bold mb-6">Netflix Originals</h1>
            {loading && <div className="text-center text-lg font-bold mt-10 text-white">Loading...</div>}
            {!loading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {movieList.map((movie) => (
                        <div key={movie.id} className="group cursor-pointer transition-transform duration-300 hover:scale-105">
                            <div className="aspect-[2/3] overflow-hidden rounded-lg">
                                <img 
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                    alt={movie.name || movie.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                />
                            </div>
                            <div className="mt-2 px-1">
                                <h2 className="text-white text-sm font-semibold truncate">{movie.name || movie.title}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </Layout>
  )
}

export default Movies
