import React, { Component } from 'react';
import './app.css';
import { Tabs } from 'antd';

import MoviesList from '../MoviesList';
import Spinner from '../Spinner';
import ErrorIndicator from '../ErrorIndicator';
import MovieSearchBar from '../MovieSearchBar';
import Paginator from '../Pagination';
import MdbApiServices from '../../services/mdbApiServices';
import { MdbapiServiceProvider } from '../../context/mdbApi-service-context';

export default class App extends Component {
  constructor() {
    super();
    this.MdbApi = new MdbApiServices();
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
    this.MdbApi.createGuestSession();
    this.MdbApi.getGenres().then((res) => {
      this.setState({
        allGenres: res,
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, searchUsePage } = this.state;
    if (searchQuery !== prevState.searchQuery || searchUsePage !== prevState.searchUsePage) {
      this.MdbApi.getResources(
        `&language=en-US&page=1&include_adult=false&query=${encodeURIComponent(searchQuery)}&page=${searchUsePage}`
      )
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
    this.MdbApi.getGuestSession(`&language=en-US&sort_by=created_at.asc&page=${newPage}`)
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
    const { rateUsePage } = this.state;
    if (activeKey === '2') {
      this.MdbApi.getGuestSession(`&language=en-US&sort_by=created_at.asc&page=${rateUsePage}`)
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
        <MdbapiServiceProvider value={this.MdbApi}>
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
                      {searchHasData ? <MoviesList moviesData={searchMoviesData} allGenres={allGenres} /> : null}
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
                      {rateHasData ? <MoviesList moviesData={rateMoviesData} allGenres={allGenres} /> : null}
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
