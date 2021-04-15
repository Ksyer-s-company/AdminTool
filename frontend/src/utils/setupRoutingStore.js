import { syncHistoryWithStore } from 'mobx-react-router';
import { createBrowserHistory } from 'history';

export default (routingStore) => {
  const browserHistory = createBrowserHistory();
  const history = syncHistoryWithStore(browserHistory, routingStore);
  return history;
};
