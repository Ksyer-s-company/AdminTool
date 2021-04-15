import { serverConfig } from '../config';
import BaseApi from './BaseApi';

class BlockInfoApi extends BaseApi {
  _parse({ response }) {
    const { data } = response;
    return data.map((obj) => ({
      code: obj.block_code,
      name: obj.block_name,
      subType: obj.sub_type,
      category: obj.category,
      pinyinName: obj.name,
    }));
  }

  constructor() {
    super(new URL('/api/block-info/', serverConfig.baseUrl));
  }
}

export const blockInfoApiInstance = new BlockInfoApi();

export default BlockInfoApi;
