import React from 'react';
import PropTypes from 'prop-types';

import './moviesList.css';
import MovieCard from '../MovieCard';

function MoviesList({ moviesData, allGenres }) {
  return (
    <>
      {moviesData.map((movie) => {
        const {
          id,
          title,
          release_date: releaseDate,
          overview,
          poster_path: posterPath,
          vote_average: average,
          rating,
          genre_ids: genresIds,
        } = movie;

        return (
          <MovieCard
            key={id}
            movieTitle={title}
            movieReleaseDate={releaseDate}
            movieOverview={overview}
            posterPath={posterPath}
            average={average}
            id={id}
            rating={rating}
            genresIds={genresIds}
            allGenres={allGenres}
          />
        );
      })}
    </>
  );
}

MoviesList.defaultProps = {
  moviesData: [],
  allGenres: {},
};

MoviesList.propTypes = {
  moviesData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  allGenres: PropTypes.objectOf(PropTypes.string),
};

export default MoviesList;
