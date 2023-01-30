export default class MdbApiServices {
  rootPath = 'https://api.themoviedb.org/';

  apiKey = '25ba5f24b224d9392a6776aad014e8c4';

  async getResources(fragment) {
    const apiBase = `${this.rootPath}3/search/movie?api_key=${this.apiKey}`;
    const response = await fetch(`${apiBase}${fragment}`);

    if (!response.ok) {
      throw new Error(`Could not fetch ${this.rootPath}, received ${response.status}`);
    }

    const body = await response.json();

    if (body.results.length === 0) {
      throw new Error();
    }
    console.log(body);
    return body;
  }

  async createGuestSession() {
    const sessionId = localStorage.getItem('sessionId');

    if (!sessionId) {
      const apiBase = `${this.rootPath}3/authentication/guest_session/new?api_key=${this.apiKey}`;
      const authentication = await fetch(apiBase);

      if (!authentication.ok) {
        throw new Error(`Could not fetch ${this.rootPath}, received ${authentication.status}`);
      }

      const guestSession = await authentication.json();

      localStorage.setItem('sessionId', guestSession.guest_session_id);
    }
  }

  async getGuestSession(fragment) {
    const guestSessionId = localStorage.getItem('sessionId');

    const response = await fetch(
      `${this.rootPath}3/guest_session/${guestSessionId}/rated/movies?api_key=${this.apiKey}${fragment}`
    );

    if (!response.ok) {
      throw new Error(`Could not fetch ${this.rootPath}, received ${response.status}`);
    }

    const body = await response.json();
    console.log(body);
    return body;
  }

  async getGenres() {
    const apiGenres = `${this.rootPath}3/genre/movie/list?api_key=${this.apiKey}`;
    const response = await fetch(apiGenres);

    if (!response.ok) {
      throw new Error();
    }

    const body = await response.json();
    console.log(body.genres);
    return body.genres;
  }

  rateMovie = (movieId, rating) => {
    const guestSessionId = localStorage.getItem('sessionId');

    fetch(`${this.rootPath}3/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        value: rating,
      }),
    });
  };
}
