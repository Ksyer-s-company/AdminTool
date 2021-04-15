import { serverConfig } from '../config';
import BaseApi from './BaseApi';

class StockInfoApi extends BaseApi {
  constructor() {
    super(new URL('/api/security-info/', serverConfig.baseUrl));
  }

  _parse({ response }) {
    const { data: responseData } = response;
    const { data: stockDataList } = responseData;
    return stockDataList.map((obj) => ({
      code: obj.code,
      symbol: obj.symbol,
      displayName: obj.display_name,
      name: obj.name,
    }));
  }
}

export const stockInfoApiInstance = new StockInfoApi();

export default StockInfoApi;
