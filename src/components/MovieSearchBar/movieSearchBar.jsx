import React from 'react';
import { debounce } from 'lodash';
import './movieSearchBar.css';

function MovieSearchBar({ createRequest }) {
  const onRequestChange = (text) => {
    if (text) {
      createRequest(text);
    }
  };

  return (
    <form>
      <input
        className="movie-search-bar"
        type="text"
        placeholder="Enter a name to search movies..."
        onChange={debounce((event) => onRequestChange(event.target.value), 800)}
        minLength={1}
        maxLength={50}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    </form>
  );
}

export default MovieSearchBar;
