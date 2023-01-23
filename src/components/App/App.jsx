import React, { Component } from 'react';

import './app.css';
import MovieCard from '../MovieCard';
import MdbApiServices from '../../services/mdbApiServices';

export default class App extends Component {
  constructor() {
    super();
    this.MdbApi = new MdbApiServices();
    this.state = {
      moviesData: [],
    };
  }

  componentDidMount() {
    this.MdbApi.getResources(`&language=en-US&page=1&include_adult=false&query=${encodeURIComponent('return')}`).then(
      (results) => {
        this.setState({
          moviesData: results,
        });
      }
    );
  }

  render() {
    const { moviesData } = this.state;

    return (
      <section className="movie-app">
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
      </section>
    );
  }
}
