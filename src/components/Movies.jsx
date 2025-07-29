import { useEffect, useState } from 'react'
import { tmdbApi, endpoints } from '../services/api/tmdb';



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
        return 
    }
    if (error) {
        return <div className="text-center text-lg font-bold mt-10">Something went wrong! Please try again.</div>;
    }
    if (!movieList.length) {
        return <div className="text-center text-lg font-bold mt-10">No movies found</div>;
    }
    
    return (
    <div>
        {loading && <div className="text-center text-lg font-bold mt-10">Loading...</div>}
        {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {movieList.map((movie) => (
                    <div key={movie.id} className="bg-gray-800 rounded-lg p-4">
                        <h2 className="text-lg font-bold mb-2 text-white">{movie.name}</h2>
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="mb-2 rounded object-cover w-full" />
                        <p className="text-sm text-gray-300">{movie.overview}</p>
                    </div>
                ))}
            </div>
        )}
        
    </div>
  )
}

export default Movies
