import { serverConfig } from '../config';
import BaseApi from './BaseApi';

class StatementSearchV2Api extends BaseApi {
  constructor() {
    super(new URL('/api/statement-search-v2/', serverConfig.baseUrl));
  }

  _parse({ response }) {
    const { data: responseData } = response;
    return responseData;
  }
}

export const statementSearchV2ApiInstance = new StatementSearchV2Api();

export default StatementSearchV2Api;
