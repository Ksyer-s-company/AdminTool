import { serverConfig } from '../config';
import BaseApi from './BaseApi';

class StatementSearchApi extends BaseApi {
  constructor() {
    super(new URL('/api/wechat-recommendation-v2/', serverConfig.baseUrl));
  }

  _parse({ response }) {
    const { data: responseData } = response;
    const { results } = responseData;
    return results;
  }
}

class StatementSearchPaginatedApi extends BaseApi {
  constructor() {
    super(new URL('/api/statement-search/', serverConfig.baseUrl));
  }

  _parse({ response }) {
    const { data: responseData } = response;
    return responseData;
  }
}

export const statementSearchPaginatedApiInstance = new StatementSearchPaginatedApi();

export const statementSearchApiInstance = new StatementSearchApi();

export default StatementSearchApi;
