import { serverConfig } from '../config';
import BaseApi from './BaseApi';

class HotStockApi extends BaseApi {
  constructor() {
    super(new URL('/api/hot-stock', serverConfig.baseUrl));
  }
}

export const HotStockApiInstance = new HotStockApi();

export default HotStockApi;
