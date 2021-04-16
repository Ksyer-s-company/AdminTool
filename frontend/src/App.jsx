import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Router, Switch, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@material-ui/core/styles';

import theme from './theme';
import setupRoutingStore from './utils/setupRoutingStore';
import rootStore from './stores/RootStore';
import './App.css';
import IndexPage from './pages';
import AdminTool from './pages/AdminTool';

export const history = setupRoutingStore(rootStore.routingStore);
const StoreContext = React.createContext({});
export const useRootStore = () => useContext(StoreContext);

const App = observer(() => (
  <Router history={history}>
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <StoreContext.Provider value={rootStore}>
          <Switch>
            {/* <Route path="/" exact component={IndexPage} /> */}
            <Route path="/" exact component={AdminTool} />
            <Route path="/admin-tool/:appId" component={AdminTool} />
            <Route>
              <Helmet>
                <title>404 Not Found</title>
              </Helmet>
              <div className="App">
                <p>404 Page not found.</p>
              </div>
            </Route>
          </Switch>
        </StoreContext.Provider>
      </ThemeProvider>
    </HelmetProvider>
  </Router>
));

export default App;
