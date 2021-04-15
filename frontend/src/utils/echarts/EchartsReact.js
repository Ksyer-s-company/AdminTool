import echarts from 'echarts';
import EchartsReactCore from './EchartsReactCore';

export default class EchartsReact extends EchartsReactCore {
  constructor(props) {
    super(props);
    this.echartsLib = echarts;
  }
}
