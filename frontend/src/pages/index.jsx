import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import Layout from '../components/Layout/Layout';
import { Helmet } from 'react-helmet-async';

const IndexPage = () => (
  <Layout>
    <Helmet>
      <title>Index Page</title>
    </Helmet>
    <Grid container direction="column">
      <Link to="/admin-tool/beijinghua">点击进入</Link>
    </Grid>
  </Layout>
);

export default IndexPage;
