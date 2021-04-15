import { serverConfig } from '../config';
import axios from 'axios';

class FinanceRatioApi {
  constructor() {
    this.url = new URL('/api/stock-reports/', serverConfig.baseUrl);
  }

  async _get({ stockId, by = 'report', fromDate, toDate, limit }) {
    const params = {
      stock_id: stockId,
      by,
    };
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;
    if (limit) params.limit = limit;
    return axios.get(this.url.toString(), { params });
  }

  _parse({ response }) {
    const { data: responseData } = response;
    const { data } = responseData;
    return data;
  }

  async request({ stockId, by, fromDate, toDate, limit }) {
    const response = await this._get({ stockId, by, fromDate, toDate, limit });
    return this._parse({ response });
  }
}

export const financeRatioApiInstance = new FinanceRatioApi();

export default FinanceRatioApi;
