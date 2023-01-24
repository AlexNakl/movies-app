import React, { Component } from 'react';

import './app.css';

import MoviesList from '../MoviesList';
import Spinner from '../Spinner';
import ErrorIndicator from '../ErrorIndicator';
import MdbApiServices from '../../services/mdbApiServices';

export default class App extends Component {
  constructor() {
    super();
    this.MdbApi = new MdbApiServices();
    this.state = {
      moviesData: [],
      loading: true,
      error: false,
      errorText: 'Your query returned no results. Please change your search criteria and try again.',
    };
  }

  componentDidMount() {
    const query = 'hobb';
    this.MdbApi.getResources(`&language=en-US&page=1&include_adult=false&query=${encodeURIComponent(query)}`)
      .then((results) => {
        this.setState({
          moviesData: results,
          loading: false,
        });
      })
      .catch(this.onError);
  }

  onError = (err) => {
    if (err.message === 'Failed to fetch') {
      this.setState({
        errorText: 'Check your internet connection.',
      });
    } else {
      this.setState({
        errorText: 'Your query returned no results. Please change your search criteria and try again.',
      });
    }

    this.setState({
      error: true,
      loading: false,
    });
  };

  render() {
    const { moviesData, loading, error, errorText } = this.state;

    const hasData = !(loading || error);

    const errorBox = error ? <ErrorIndicator errorText={errorText} /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = hasData ? <MoviesList moviesData={moviesData} /> : null;

    return (
      <div>
        <section className="movie-content">
          {spinner}
          {errorBox}
          {content}
        </section>
      </div>
    );
  }
}
