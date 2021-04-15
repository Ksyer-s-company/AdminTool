import { serverConfig } from '../config';
import axios from 'axios';

class IndustryLeadersApi {
  constructor() {
    this.url = new URL('/api/industry-leaders/', serverConfig.baseUrl);
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
    // const { data } = response.data;
    return data;
  }

  async request({ stockId }) {
    const response = await this._get({ stockId });
    return this._parse({ response });
  }
}

export const industryLeadersApiInstance = new IndustryLeadersApi();

export default IndustryLeadersApi;
