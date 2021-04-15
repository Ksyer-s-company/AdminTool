import { serverConfig } from '../config';
import BaseApi from './BaseApi';

class HotWordApi extends BaseApi {
  constructor() {
    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate();
    var curdate = Y + M + D;
    super(
      new URL(
        '/api/hot-word-article/?start_date=1970-01-01&end_date=' + curdate + '&mode=word',
        serverConfig.baseUrl
      )
    );
  }

  _parse({ response }) {
    const { data } = response.data;
    return data;
  }
}

export const hotWordsApi = new HotWordApi();

export default HotWordApi;
