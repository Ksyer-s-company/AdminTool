import axios from 'axios';

class MockDataApi {
  uri = '/data/mock-data.json';

  async get() {
    const { data } = await axios.get(this.uri);
    return data;
  }
}

export default new MockDataApi();
