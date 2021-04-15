import { serverConfig } from '../config';
import axios from 'axios';

class RawArticleApi {
  constructor() {
    this.url = new URL('/api/article-raw/', serverConfig.baseUrl);
  }

  async _get({ articleId }) {
    const params = {
      article_id: articleId,
    };
    return await axios.get(this.url.toString(), { params });
  }

  _parse({ response }) {
    const { data: responseData } = response;
    const { data } = responseData;
    return data;
  }

  async request(articleId) {
    const response = await this._get({ articleId });
    return this._parse({ response });
  }
}

export const rawArticleApi = new RawArticleApi();

export default RawArticleApi;
