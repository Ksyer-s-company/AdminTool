import axios from 'axios';

const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

class BaseApi {
  constructor(url) {
    this.url = url;
    this.paramMap = {};
  }

  _parse({ response }) {
    const { data } = response;
    return data;
  }

  _parse_params(params) {
    const parsedParams = {};
    for (let key in params) {
      parsedParams[camelToSnakeCase(key)] = params[key];
    }
    return parsedParams;
  }

  async _get(params) {
    return axios.get(this.url.toString(), { params: this._parse_params(params) });
  }

  async request(params) {
    const response = await this._get(params);
    return this._parse({ response });
  }
}

export default BaseApi;
