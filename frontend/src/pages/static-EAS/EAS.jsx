import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { serverConfig } from '../../config';
import axios from 'axios';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
  })
);

export default function EAS() {
  const classes = useStyles();
  const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();

  useEffect(() => {
    let initUrl = new URL('/api/repeater', serverConfig.baseUrl);
    axios({
      method: 'GET',
      url: initUrl,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }, []);

  return (
    <Grid>
      <Typography className={classes.root}>
        <Link href="http://eas.ksyer.com/" onClick={preventDefault}>
          软件工程课程设计 员工考勤管理系统
        </Link>
      </Typography>
    </Grid>
  );
}
