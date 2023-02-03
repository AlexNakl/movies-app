import React from 'react';
import PropTypes from 'prop-types';

import './moviesList.css';
import MovieCard from '../MovieCard';
import { MdbapiServiceConsumer } from '../../context/mdbApi-service-context';

function MoviesList({ moviesData, allGenres, refreshMoviesData }) {
  return (
    <MdbapiServiceConsumer>
      {({ idRatedMovies }) => (
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
                rating={id in idRatedMovies ? idRatedMovies[id] : rating}
                genresIds={genresIds}
                allGenres={allGenres}
                refreshMoviesData={refreshMoviesData}
              />
            );
          })}
        </>
      )}
    </MdbapiServiceConsumer>
  );
}

MoviesList.defaultProps = {
  moviesData: [],
  allGenres: {},
  refreshMoviesData: () => {},
};

MoviesList.propTypes = {
  moviesData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  allGenres: PropTypes.objectOf(PropTypes.string),
  refreshMoviesData: PropTypes.func,
};

export default MoviesList;
