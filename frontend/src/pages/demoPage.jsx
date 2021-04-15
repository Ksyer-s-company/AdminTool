import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { StoreProvider, useStore } from './StockApp/stores/store';

const useStyles = makeStyles({
  container: {
    padding: 8,
  },
});

const DemoPageInner = () => {
  const classes = useStyles();
  const store = useStore();
  const { entitySearch } = store;
  return <div className={classes.container}>Demo Page</div>;
};

const demoPage = () => (
  <StoreProvider>
    <DemoPageInner />
  </StoreProvider>
);

export default demoPage;
