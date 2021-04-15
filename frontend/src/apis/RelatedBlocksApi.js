import { serverConfig } from '../config';
import BaseApi from './BaseApi';

class RelatedBlocksApi extends BaseApi {
  constructor() {
    super(new URL('/api/security-blocks/', serverConfig.baseUrl));
  }
}

export const relatedBlocksApiInstance = new RelatedBlocksApi();

export default RelatedBlocksApi;
