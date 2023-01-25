import React, { Component } from 'react';
import './app.css';

import MoviesList from '../MoviesList';
import Spinner from '../Spinner';
import ErrorIndicator from '../ErrorIndicator';
import MovieSearchBar from '../MovieSearchBar';
import Paginator from '../Pagination';
import MdbApiServices from '../../services/mdbApiServices';

export default class App extends Component {
  constructor() {
    super();
    this.MdbApi = new MdbApiServices();
    this.state = {
      moviesData: [],
      loading: false,
      error: false,
      errorText: 'Your query returned no results. Please change your search criteria and try again.',
      query: '',
      usePage: 1,
      totalResults: 0,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { query, usePage } = this.state;
    if (query !== prevState.query || usePage !== prevState.usePage) {
      this.MdbApi.getResources(
        `&language=en-US&page=1&include_adult=false&query=${encodeURIComponent(query)}&page=${usePage}`
      )
        .then((body) => {
          this.setState({
            moviesData: body.results,
            loading: false,
            totalResults: body.total_results,
          });
        })
        .catch(this.onError);
    }
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

  createRequest = (text) => {
    this.setState({
      query: text,
      error: false,
      loading: true,
      usePage: 1,
    });
  };

  changePage = (newPage) => {
    this.setState({
      usePage: newPage,
      loading: true,
    });
  };

  render() {
    const { moviesData, loading, error, errorText, usePage, totalResults } = this.state;

    const hasData = !(loading || error);
    const showPagin = moviesData.length !== 0 && hasData;

    const errorBox = error ? <ErrorIndicator errorText={errorText} /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = hasData ? <MoviesList moviesData={moviesData} /> : null;
    const pagin = showPagin ? (
      <Paginator usePage={usePage} totalResults={totalResults} onChangePage={this.changePage} />
    ) : null;

    return (
      <section className="movie-app">
        <MovieSearchBar createRequest={this.createRequest} />
        <div className="movie-content">
          {spinner}
          {errorBox}
          {content}
        </div>
        <div className="paginator">{pagin}</div>
      </section>
    );
  }
}
