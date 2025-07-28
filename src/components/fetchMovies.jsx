import React, { useEffect, useState } from 'react'
import { tmdbApi, endpoints } from '../services/tmdb';

// In your component


const Movie = () => {
    const [movieList, setMovieList] = useState([])

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await tmdbApi.get(endpoints.fetchNetflixOriginals);
                setMovieList(data.results);
            } catch (error) {
                console.error('Failed to fetch movies:', error);
            }
        };

        fetchMovies();
    }, []);

    console.log(movieList)
    return (
    <div>
        {movieList.map((movie, index) => (
            <div key={index} className='text-lg font-bold'>
                {movie.title}
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <p className='text-sm'>{movie.overview}</p>
            </div>
        ))}
    </div>
  )
}

export default Movie
