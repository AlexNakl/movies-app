import React from 'react';
import PropTypes from 'prop-types';
import './movieGenres.css';

function MovieGenres({ genreName }) {
  return <li className="movie-genre">{genreName}</li>;
}

MovieGenres.defaultProps = {
  genreName: 'NA',
};

MovieGenres.propTypes = {
  genreName: PropTypes.string,
};

export default MovieGenres;
