import React, { Component } from 'react';
import './app.css';
import { Tabs } from 'antd';

import MoviesList from '../MoviesList';
import Spinner from '../Spinner';
import ErrorIndicator from '../ErrorIndicator';
import MovieSearchBar from '../MovieSearchBar';
import Paginator from '../Pagination';
import MdbApiBaseServices from '../../services/mdbApiBaseServices';
import MdbApiSessionServices from '../../services/mdbApiSessionServices';
import { MdbapiServiceProvider } from '../../context/mdbApi-service-context';

export default class App extends Component {
  constructor() {
    super();
    this.MdbApiBase = new MdbApiBaseServices();
    this.MdbApiSession = new MdbApiSessionServices();
    this.state = {
      searchMoviesData: [],
      rateMoviesData: [],
      searchLoading: false,
      rateLoading: false,
      searchError: false,
      rateError: false,
      searchUsePage: 1,
      rateUsePage: 1,
      searchTotalResults: 0,
      rateTotalResults: 0,
      searchErrorText: '',
      rateErrorText: '',
      searchQuery: '',
      allGenres: {},
    };
  }

  componentDidMount() {
    this.MdbApiSession.createGuestSession().catch((err) => {
      console.error(err, err.message);
      this.onSearchError(err);
    });
    this.MdbApiBase.getGenres()
      .then((res) => {
        this.setState({
          allGenres: res,
        });
      })
      .catch((err) => {
        console.error(err, err.message);
        this.onSearchError(err);
      });
    this.MdbApiSession.getAllGuestSession().catch((err) => {
      console.error(err, err.message);
      this.onSearchError(err);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, searchUsePage } = this.state;

    if (searchQuery !== prevState.searchQuery || searchUsePage !== prevState.searchUsePage) {
      this.MdbApiBase.getResources(searchQuery, searchUsePage)
        .then((body) => {
          this.setState({
            searchMoviesData: body.results,
            searchLoading: false,
            searchTotalResults: body.total_results,
          });
        })
        .catch(this.onSearchError);
    }
  }

  onSearchError = (err) => {
    if (err.message === 'Failed to fetch') {
      this.setState({
        searchErrorText: 'Check your internet connection.',
      });
    } else if (err.message === 'Failed to create guest room.') {
      this.setState({
        searchErrorText: 'Failed to create guest room. Try refreshing the page.',
      });
    } else if (err.message === 'Failed to get genre list.') {
      this.setState({
        searchErrorText: 'Failed to get genre list. Try refreshing the page.',
      });
    } else if (err.message === 'Failed to get guest datas.') {
      this.setState({
        searchErrorText: 'Failed to get guest datas. Try refreshing the page.',
      });
    } else {
      this.setState({
        searchErrorText: 'Your query returned no results. Please change your search criteria and try again.',
      });
    }

    this.setState({
      searchError: true,
      searchLoading: false,
    });
  };

  onRateError = (err) => {
    if (err.message === 'Failed to fetch') {
      this.setState({
        rateErrorText: 'Check your internet connection.',
      });
    } else {
      this.setState({
        rateErrorText: 'Sorry. Something went wrong.',
      });
    }
    this.setState({
      rateError: true,
      rateLoading: false,
    });
  };

  createRequest = (text) => {
    this.setState({
      searchQuery: text,
      searchError: false,
      searchLoading: true,
      searchUsePage: 1,
    });
  };

  changeSearchPage = (newPage) => {
    this.setState({
      searchUsePage: newPage,
      searchLoading: true,
    });
  };

  changeRatePage = (newPage) => {
    this.MdbApiSession.getGuestSession(newPage)
      .then((body) => {
        this.setState({
          rateMoviesData: body.results,
          rateLoading: false,
          rateTotalResults: body.total_results,
        });
      })
      .catch(this.onRateError);

    this.setState({
      rateUsePage: newPage,
      rateLoading: true,
    });
  };

  onChangeTabs = (activeKey) => {
    if (activeKey === '2') {
      const { rateUsePage } = this.state;
      this.MdbApiSession.getGuestSession(rateUsePage)
        .then((body) => {
          this.setState({
            rateMoviesData: body.results,
            rateLoading: false,
            rateTotalResults: body.total_results,
            rateUsePage: body.page,
          });
        })
        .catch(this.onRateError);
      this.setState({
        rateLoading: true,
      });
    }
  };

  refreshMoviesData = (movieId, rating) => {
    const { searchMoviesData, rateMoviesData } = this.state;
    const newArrSearch = JSON.parse(JSON.stringify(searchMoviesData));
    const newArrRate = JSON.parse(JSON.stringify(rateMoviesData));

    newArrSearch.forEach((movie, index) => {
      if (movie.id === movieId) {
        newArrSearch[index].rating = rating;
      }
    });
    newArrRate.forEach((movie, index) => {
      if (movie.id === movieId) {
        newArrRate[index].rating = rating;
      }
    });

    this.setState({
      searchMoviesData: newArrSearch,
      rateMoviesData: newArrRate,
    });
  };

  render() {
    const {
      searchMoviesData,
      searchLoading,
      searchError,
      searchUsePage,
      searchTotalResults,
      rateMoviesData,
      rateLoading,
      rateError,
      rateUsePage,
      rateTotalResults,
      searchQuery,
      searchErrorText,
      rateErrorText,
      allGenres,
    } = this.state;

    const searchHasData = !(searchLoading || searchError);
    const searchShowPagin = searchMoviesData.length !== 0 && searchHasData;

    const rateHasData = !(rateLoading || rateError);
    const rateShowPagin = rateMoviesData.length !== 0 && rateHasData;

    return (
      <section className="movie-app">
        <MdbapiServiceProvider value={this.MdbApiSession}>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: 'Search',
                children: (
                  <>
                    <MovieSearchBar createRequest={this.createRequest} query={searchQuery} />
                    <div className="movie-content">
                      {searchLoading ? <Spinner /> : null}
                      {searchError ? <ErrorIndicator errorText={searchErrorText} /> : null}
                      {searchHasData ? (
                        <MoviesList
                          moviesData={searchMoviesData}
                          allGenres={allGenres}
                          refreshMoviesData={this.refreshMoviesData}
                        />
                      ) : null}
                    </div>
                    <div className="paginator">
                      {searchShowPagin ? (
                        <Paginator
                          usePage={searchUsePage}
                          totalResults={searchTotalResults}
                          onChangePage={this.changeSearchPage}
                        />
                      ) : null}
                    </div>
                  </>
                ),
              },
              {
                key: '2',
                label: 'Rated',
                children: (
                  <>
                    <div className="movie-content">
                      {rateLoading ? <Spinner /> : null}
                      {rateError ? <ErrorIndicator errorText={rateErrorText} /> : null}
                      {rateHasData ? (
                        <MoviesList
                          moviesData={rateMoviesData}
                          allGenres={allGenres}
                          refreshMoviesData={this.refreshMoviesData}
                        />
                      ) : null}
                    </div>
                    <div className="paginator">
                      {rateShowPagin ? (
                        <Paginator
                          usePage={rateUsePage}
                          totalResults={rateTotalResults}
                          onChangePage={this.changeRatePage}
                        />
                      ) : null}
                    </div>
                  </>
                ),
              },
            ]}
            onChange={(activeKey) => this.onChangeTabs(activeKey)}
          />
        </MdbapiServiceProvider>
      </section>
    );
  }
}
