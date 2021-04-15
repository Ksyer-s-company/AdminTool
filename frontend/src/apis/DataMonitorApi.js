import { serverConfig } from '../config';
import BaseApi from './BaseApi';
import axios from 'axios';

class DataMonitorApi {
  constructor() {
    this.url = new URL('/api/data-monitor/', serverConfig.baseUrl);
  }

  async _post({ startTime, endTime }) {
    const params = { start_time: startTime, end_time: endTime };
    return await axios.post(this.url.toString(), { params });
  }

  async _get() {
    const params = { start_time: '20200101', end_time: '20200105' };
    return await axios.get(this.url.toString(), { params });
  }

  async request({ startTime, endTime }) {
    const response = await this._get({ startTime, endTime });
    return this._parse({ response });
  }

  _parse({ response }) {
    const { data } = response.data;
    return data;
  }
}

export const dataDetailsApi = new DataMonitorApi();

export default DataMonitorApi;
