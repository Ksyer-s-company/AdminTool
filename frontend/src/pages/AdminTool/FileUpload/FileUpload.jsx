import React, { Component, useRef, useState } from 'react';
import { render } from 'react-dom';
import { serverConfig } from '../../../config';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import SimpleSnackbar from './SimpleSnackbar';
import axios from 'axios';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
    },
  })
);

export default function FormUpload() {
  const classes = useStyles();
  const [warningMessage, setWarningMessage] = useState('init');
  const [severity, setSeverity] = useState('info');
  const [loading, setLoading] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  };

  const submit = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let url = new URL('/api/upload-file/', serverConfig.baseUrl);
    var warningMessage, severity, loading, fileName;
    axios({
      method: 'POST',
      url: url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        const status_code = parseInt(response.data.status_code);

        switch (status_code) {
          case 200:
            warningMessage = response.data.filename + '上传成功';
            severity = 'success';
            loading = false;
            fileName = response.data.filename;
            break;
          case 404:
            warningMessage = '未上传文件';
            severity = 'error';
            loading = false;
            break;
          case 500:
            warningMessage = '文件格式错误';
            severity = 'error';
            loading = false;
            fileName = response.data.filename;
            break;
          default:
            warningMessage = '系统错误';
            severity = 'error';
            loading = false;
        }
      })
      .catch((e) => {
        console.log('error: ', e);
        warningMessage = '系统错误';
        severity = 'error';
        loading = false;
      })
      .finally(() => {
        setWarningMessage(warningMessage);
        setSeverity(severity);
        setLoading(loading);
        setSnackBarOpen(true);
        setFileName(fileName);
      });
  };

  const handleSelectFile = (e) => {
    var filePath = e.target.value.split('\\');
    var fileName = filePath.slice(-1)[0];
    setFileName(fileName);
  };

  return (
    <div>
      <form onSubmit={submit}>
        <Grid spaceing={2} container direction="row" justify="flex-start" alignItems="flex-start">
          <Grid item xs={3}>
            <label htmlFor="upload-file">
              <input
                name="upload-file"
                accept=".xlsx,.xls"
                className={classes.input}
                id="upload-file"
                multiple
                type="file"
                onChange={handleSelectFile}
              />
              <Button color="primary" variant="contained" component="span">
                选择文件
              </Button>
            </label>
            {fileName ? '    ' + fileName : ''}
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" color="primary" type="submit" id="btnSave">
              提交
            </Button>
          </Grid>
        </Grid>
      </form>

      <SimpleSnackbar
        snackBarOpen={snackBarOpen}
        warningMessage={warningMessage}
        severity={severity}
        handleSnackBarClose={handleSnackBarClose}
      />
    </div>
  );
}
