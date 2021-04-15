import React from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import { observer } from 'mobx-react';

import { useRootStore } from '../../App';
import { stockAppList, stockAppNameMap } from '../../config';

const StockNav = observer((props) => {
  alert(1);
  const { currentApp, navigate } = props;
  return (
    <ButtonGroup>
      {stockAppList.map((key) =>
        currentApp === key ? (
          <Button variant="contained" color="primary" key={key}>
            {stockAppNameMap[key]}
          </Button>
        ) : (
          <Button key={key}>{stockAppNameMap[key]}</Button>
        )
      )}
    </ButtonGroup>
  );
});

const StockNavWithStore = observer((props) => {
  const {
    routingStore: { location, history },
  } = useRootStore();
  let currentApp = null;
  for (let key of stockAppList) {
    if (location.pathname.startsWith(`/${key}`)) currentApp = key;
  }
  const navigate = history.push;
  return <StockNav currentApp={currentApp} navigate={navigate} />;
});

export default StockNavWithStore;
