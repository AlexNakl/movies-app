import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import './movieSearchBar.css';

function MovieSearchBar({ createRequest, query }) {
  const onRequestChange = (text) => {
    if (text && text !== query) {
      createRequest(text);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        className="movie-search-bar"
        type="text"
        placeholder="Enter a name to search movies..."
        onChange={debounce((event) => onRequestChange(event.target.value), 800)}
        minLength={1}
        maxLength={50}
        defaultValue={query}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    </form>
  );
}

MovieSearchBar.defaultProps = {
  createRequest: () => {},
  query: '',
};

MovieSearchBar.propTypes = {
  createRequest: PropTypes.func,
  query: PropTypes.string,
};

export default MovieSearchBar;
