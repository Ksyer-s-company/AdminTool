import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { Route, useParams, useRouteMatch } from 'react-router-dom';
import { Skeleton } from '@material-ui/lab';

const ManualArticle = observer(() => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        手动添加文章
      </Grid>
    </Grid>
  );
});

export default ManualArticle;
