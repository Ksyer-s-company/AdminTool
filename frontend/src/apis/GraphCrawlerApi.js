import { serverConfig } from '../config';
import BaseApi from './BaseApi';

class GraphCrawlerApi extends BaseApi {
  constructor() {
    super(new URL('/api/graph-crawler/', serverConfig.baseUrl));
  }
}

export const graphCrawlerApiInstance = new GraphCrawlerApi();

export default GraphCrawlerApi;
