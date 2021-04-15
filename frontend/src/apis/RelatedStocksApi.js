import { serverConfig } from '../config';
import axios from 'axios';

class RelatedStocksApi {
  constructor() {
    this.url = new URL('/api/related-securities/', serverConfig.baseUrl);
  }

  async _get({ industryId }) {
    const params = { industry_id: industryId };
    return axios.get(this.url.toString(), { params });
  }

  _parse({ response }) {
    const { data: responseData } = response;
    const { data } = responseData;
    return data.map((obj, i) => ({
      stockInfo: {
        code: obj.code,
        symbol: obj.symbol,
        displayName: obj.display_name,
        name: obj.name,
      },
      peerFinanceData: {
        rank: i + 1,
        ...obj,
      },
    }));
  }

  async request({ industryId }) {
    const response = await this._get({ industryId });
    return this._parse({ response });
  }
}

export const relatedStocksApiInstance = new RelatedStocksApi();

export default RelatedStocksApi;
