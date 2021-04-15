import { observable } from 'mobx';
import { RouterStore } from 'mobx-react-router';

class rootStore {
  @observable name = 'rootStore';

  routingStore = null;

  constructor() {
    this.routingStore = new RouterStore();
  }
}

export default new rootStore();
