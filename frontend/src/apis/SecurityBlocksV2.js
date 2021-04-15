import { serverConfig } from '../config';
import BaseApi from './BaseApi';

class SecurityBlocksV2Api extends BaseApi {
  constructor() {
    super(new URL('/api/security-blocks-v2/', serverConfig.baseUrl));
  }
}

export const securityBlocksV2ApiInstance = new SecurityBlocksV2Api();

export default SecurityBlocksV2Api;
