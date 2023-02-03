export default class MdbApiBaseServices {
  baseUrl = new URL('https://api.themoviedb.org');

  apiKey = '25ba5f24b224d9392a6776aad014e8c4';

  async getResources(searchQuery, searchUsePage) {
    const urlSearchMovie = new URL('/3/search/movie', this.baseUrl);
    const queries = {
      api_key: this.apiKey,
      language: 'en-US',
      query: searchQuery,
      page: searchUsePage,
    };
    const params = new URLSearchParams(queries);

    urlSearchMovie.search = params.toString();

    const response = await fetch(urlSearchMovie);

    if (!response.ok) {
      throw new Error(`Could not fetch ${urlSearchMovie}, received ${response.status}`);
    }

    const body = await response.json();

    if (body.results.length === 0) {
      throw new Error(`Empty result ${urlSearchMovie}`);
    }

    return body;
  }

  async getGenres() {
    const urlGenresMovieList = new URL('/3/genre/movie/list', this.baseUrl);
    urlGenresMovieList.searchParams.append('api_key', this.apiKey);

    const response = await fetch(urlGenresMovieList);

    if (!response.ok) {
      throw new Error('Failed to get genre list.');
    }

    const body = await response.json();

    if (body.genres.length === 0) {
      throw new Error('Empty genre list.');
    }

    const genresObj = {};

    body.genres.forEach((obj) => {
      genresObj[obj.id] = obj.name;
    });
    return genresObj;
  }
}
