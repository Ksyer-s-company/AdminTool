import { serverConfig } from '../config';
import BaseApi from './BaseApi';

class TopicKeywordApi extends BaseApi {
  constructor() {
    super(new URL('/api/topic-keyword/', serverConfig.baseUrl));
  }

  _parse({ response }) {
    const { data } = response;
    return data.map((obj) => ({
      topicId: String(obj.topic_id),
      topic: String(obj.topic),
      keyword: String(obj.keyword),
    }));
  }
}

export const topicKeywordApiInstance = new TopicKeywordApi();

export default TopicKeywordApi;
