import React from 'react';

import './moviesList.css';
import MovieCard from '../MovieCard';

function MoviesList({ moviesData }) {
  return (
    <>
      {moviesData.map((movie) => {
        const { id, title, release_date: releaseDate, overview, poster_path: posterPath } = movie;

        return (
          <MovieCard
            key={id}
            movieTitle={title}
            movieReleaseDate={releaseDate}
            movieOverview={overview}
            posterPath={posterPath}
          />
        );
      })}
    </>
  );
}

export default MoviesList;
