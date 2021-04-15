import { serverConfig } from '../config';
import BaseApi from './BaseApi';

class RisingBlockApi extends BaseApi {
  constructor() {
    super(new URL('/api/rising-block', serverConfig.baseUrl));
  }
}

export const RisingBlockApiInstance = new RisingBlockApi();

export default RisingBlockApi;
