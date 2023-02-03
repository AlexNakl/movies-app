import MdbApiBaseServices from './mdbApiBaseServices';

export default class MdbApiSessionServices extends MdbApiBaseServices {
  sessionId = localStorage.getItem('sessionId');

  idRatedMovies = {};

  async createGuestSession() {
    if (!this.sessionId) {
      const urlCreateGuestSession = new URL('/3/authentication/guest_session/new', this.baseUrl);
      urlCreateGuestSession.searchParams.append('api_key', this.apiKey);

      const authentication = await fetch(urlCreateGuestSession);

      if (!authentication.ok) {
        throw new Error('Failed to create guest room.');
      }

      const guestSession = await authentication.json();

      localStorage.setItem('sessionId', guestSession.guest_session_id);
      this.sessionId = localStorage.getItem('sessionId');
    }
  }

  async getGuestSession(Page) {
    const urlGuestSessionRatedMovies = new URL(`/3/guest_session/${this.sessionId}/rated/movies`, this.baseUrl);
    const queries = {
      api_key: this.apiKey,
      language: 'en-US',
      sort_by: 'created_at.asc',
      page: Page,
    };
    const params = new URLSearchParams(queries);

    urlGuestSessionRatedMovies.search = params.toString();

    const response = await fetch(urlGuestSessionRatedMovies);

    if (!response.ok) {
      throw new Error('Failed to get guest datas.');
    }

    const body = await response.json();

    return body;
  }

  async getAllGuestSession(iPage = 1) {
    const res = await this.getGuestSession(iPage);
    res.results.forEach((movie) => {
      this.idRatedMovies[movie.id] = movie.rating;
    });
    if (!(iPage === res.total_pages || res.total_pages === 0 || res.total_results === 0)) {
      /* eslint-disable-next-line */
      iPage += 1;
      this.getAllGuestSession(iPage);
    }
  }

  rateMovie = (movieId, rating) => {
    const urlRateMovie = new URL(`/3/movie/${movieId}/rating`, this.baseUrl);
    urlRateMovie.searchParams.append('api_key', this.apiKey);
    urlRateMovie.searchParams.append('guest_session_id', this.sessionId);

    fetch(urlRateMovie, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: rating,
      }),
    }).then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          return Promise.reject(new Error(`Response failed: ${response.status} ${urlRateMovie}`));
        }
        if (response.status === 404) {
          return Promise.reject(new Error(`Response failed: ${response.status} ${urlRateMovie}`));
        }
        return Promise.reject(new Error(`Response failed: ${response.status} (${response.statusText})`));
      }
      return response.json();
    });
  };

  setNewRateMovie = (movieId, rating) => {
    this.idRatedMovies[movieId] = rating;
  };
}
