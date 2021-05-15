import React from 'react';
import { observer } from 'mobx-react';

import logo from '../logo.svg';
import { Helmet } from 'react-helmet-async';

function DefaultApp() {
  return (
    <>
      <Helmet>
        <title>React App</title>
      </Helmet>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            Edit <code>src/App.js</code> and save to reload.
          </div>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </>
  );
}

export default observer(DefaultApp);
