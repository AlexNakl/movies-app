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
}
