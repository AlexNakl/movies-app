import React, { Component } from 'react';
import './movieCard.css';
import format from 'date-fns/format';

import img from '../../helpers/noImg.png';
import shortenText from '../../helpers';

export default class MovieCard extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { movieTitle, movieReleaseDate, movieOverview, posterPath } = this.props;
    const mainPath = 'https://image.tmdb.org/t/p/original';
    const allPath = posterPath !== null ? `${mainPath}${posterPath}` : img;
    return (
      <div className="wraper-card">
        <div className="img-container">
          <img src={allPath} alt="Movie poster" />
        </div>
        <div className="movie-info">
          <h2 className="movie-title">{movieTitle}</h2>
          <p className="movie-release-date">
            {movieReleaseDate ? format(new Date(Date.parse(movieReleaseDate)), 'MMMM d, yyyy') : ''}
          </p>
          <ul className="movie-genres">
            <li className="movie-genre">Action</li>
            <li className="movie-genre">Drama</li>
          </ul>
          <p className="movie-overview">{shortenText(movieOverview)}</p>
        </div>
      </div>
    );
  }
}
