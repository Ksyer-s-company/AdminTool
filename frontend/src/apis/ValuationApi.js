import { serverConfig } from '../config';
import axios from 'axios';

class ValuationApi {
  constructor() {
    this.url = new URL('/api/valuation/', serverConfig.baseUrl);
  }

  async _get({ stockId, limit }) {
    const params = { stock_id: stockId, limit };
    return await axios.get(this.url.toString(), { params });
  }

  _parse({ response }) {
    const { data: responseData } = response;
    const { data } = responseData;
    return data;
  }

  async request({ stockId, limit = 20 }) {
    const response = await this._get({ stockId, limit });
    return this._parse({ response });
  }
}

export const valuationApiInstance = new ValuationApi();

export default ValuationApi;
