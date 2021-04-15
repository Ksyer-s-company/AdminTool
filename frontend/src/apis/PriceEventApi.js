import { serverConfig } from '../config';
import axios from 'axios';

class PriceEventApi {
  constructor() {
    this.url = new URL('/api/price-event/', serverConfig.baseUrl);
  }

  async _get({ stockId }) {
    const params = {
      stock_id: stockId,
    };
    return await axios.get(this.url.toString(), { params });
  }

  _parse({ response }) {
    const { data: responseData } = response;
    const { data } = responseData;
    return data;
  }

  async request({ stockId }) {
    const response = await this._get({ stockId });
    return this._parse({ response });
  }
}

export const priceEventApiInstance = new PriceEventApi();

export default PriceEventApi;
