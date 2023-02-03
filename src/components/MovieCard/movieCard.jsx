import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import { Rate } from 'antd';
import './movieCard.css';

import img from '../../helpers/noImg.png';
import { shortenText, getClassNameForAverage } from '../../helpers';
import { MdbapiServiceConsumer } from '../../context/mdbApi-service-context';
import MovieGenres from '../MovieGenres';

function MovieCard({
  movieTitle,
  movieReleaseDate,
  movieOverview,
  posterPath,
  average,
  id,
  rating,
  genresIds,
  allGenres,
  refreshMoviesData,
}) {
  const mainPath = 'https://image.tmdb.org/t/p/original';
  const allPath = posterPath !== null ? `${mainPath}${posterPath}` : img;

  const classNameAverage = getClassNameForAverage(average);

  return (
    <MdbapiServiceConsumer>
      {({ rateMovie, setNewRateMovie }) => (
        <div className="wraper-card">
          <div className="img-container">
            <img src={allPath} alt="Movie poster" />
          </div>
          <div className="movie-info">
            <div className="wraper-movie-info">
              <div className="wraper-title">
                <h2 className="movie-title">{movieTitle}</h2>
                <div className={classNameAverage}>
                  <p>{average}</p>
                </div>
              </div>
              <p className="movie-release-date">
                {movieReleaseDate ? format(new Date(Date.parse(movieReleaseDate)), 'MMMM d, yyyy') : ''}
              </p>
              <ul className="movie-genres">
                {genresIds.map((genreId) => (
                  <MovieGenres key={genreId} genreName={allGenres[genreId]} />
                ))}
              </ul>
              <p className="movie-overview">{shortenText(movieOverview, movieTitle.length, genresIds.length)}</p>
            </div>
            <div className="movie-rate">
              <Rate
                allowHalf
                count={10}
                defaultValue={0}
                value={rating}
                style={{ fontSize: 17 }}
                onChange={(value) => {
                  setNewRateMovie(String(id), value);
                  rateMovie(String(id), value);
                  refreshMoviesData(id, value);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </MdbapiServiceConsumer>
  );
}

MovieCard.defaultProps = {
  id: 0,
  rating: 0,
  average: 0,
  genresIds: [],
  movieTitle: '',
  posterPath: '',
  movieReleaseDate: '',
  movieOverview: '',
  allGenres: {},
  refreshMoviesData: () => {},
};

MovieCard.propTypes = {
  id: PropTypes.number,
  rating: PropTypes.number,
  average: PropTypes.number,
  movieTitle: PropTypes.string,
  posterPath: PropTypes.string,
  movieReleaseDate: PropTypes.string,
  movieOverview: PropTypes.string,
  genresIds: PropTypes.arrayOf(PropTypes.number),
  allGenres: PropTypes.objectOf(PropTypes.string),
  refreshMoviesData: PropTypes.func,
};

export default MovieCard;
