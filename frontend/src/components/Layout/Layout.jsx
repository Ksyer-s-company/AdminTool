import React from 'react';
import { AppBar, Button, Container, Grid, Typography } from '@material-ui/core';

import useStyles from './useStyles';

// A layout component that contains an AppBar and a content container
const Layout = ({ children }) => {
  const classes = useStyles();
  return (
    <>
      <AppBar className={classes.appBar} position="fixed">
        <Container maxWidth="lg">
          <Grid container>
            <Grid item component="a" href="/">
              <img src="/logo.png" className={classes.logo} />
              <Typography variant="h5" display="inline">
                Ksyer's website
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </AppBar>
      <Container maxWidth="lg" className={classes.root}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
