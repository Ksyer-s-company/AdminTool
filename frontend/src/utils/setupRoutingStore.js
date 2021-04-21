import { syncHistoryWithStore } from 'mobx-react-router';
import { createBrowserHistory, createHashHistory } from 'history';

export default (routingStore) => {
  // const browserHistory = createBrowserHistory();
  const browserHistory = createHashHistory();
  const history = syncHistoryWithStore(browserHistory, routingStore);
  return history;
};
