import React, { useState } from 'react';
import { Grid, TextField, Paper } from '@material-ui/core';
import { serverConfig } from '../../config';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import SimpleSnackbar from '../SimpleSnackbar';
import ReactMarkdown from 'react-markdown';

export default function DownloadMarkdown() {
  const [loading, setLoading] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const [code, setCode] = useState('');
  const [ID, setID] = useState('');

  const [warningMessage, setWarningMessage] = useState('init');
  const [severity, setSeverity] = useState('info');

  const isEmpty = (code) => {
    if (code == '') return false;
    return true;
  };

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  };

  const getCode = (e) => {
    e.preventDefault();

    // Props of SimpleSnackbar
    var tempWarningMessage = '';
    var tempSeverity = '';
    var tempLoading = true;
    var tempCode = '';

    setLoading(loading);

    var emptyFlag = isEmpty(code + ID);
    var tempID;

    if (!emptyFlag) {
      tempWarningMessage = '所填内容不能为空';
      tempSeverity = 'error';
      setWarningMessage(tempWarningMessage);
      setSeverity(tempSeverity);
      setLoading(false);
      setSnackBarOpen(true);
    } else {
      let postUrl = new URL('/api/download_markdown', serverConfig.baseUrl);
      let formData = new FormData();
      formData.append('ID', ID);

      axios({
        method: 'POST',
        url: postUrl,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((response) => response.data)
        .then((data) => {
          tempWarningMessage = data['warningMessage'];
          tempSeverity = data['severity'];
          tempLoading = false;
          tempCode = data['data'];
        })
        .catch(function (e) {
          console.log('error: ', e);
          tempWarningMessage = '系统错误';
          tempSeverity = 'error';
          tempLoading = false;
          tempCode = '';
        })
        .finally(() => {
          if (!emptyFlag) loading = false;
          setWarningMessage(tempWarningMessage);
          setSeverity(tempSeverity);
          setLoading(tempLoading);
          setCode(tempCode);
          setSnackBarOpen(true);
        });
    }
  };

  return (
    <Grid>
      <form onSubmit={getCode}>
        <div>
          <TextField
            type="input"
            id="inputContent"
            name="inputContent"
            label="id"
            placeholder=""
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={ID}
            onChange={(e) => setID(e.target.value)}
          />
        </div>

        <Grid item>
          <div>
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              提交
            </Button>
            {loading && <CircularProgress size={24} />}
          </div>
        </Grid>
      </form>

      <br />

      <Grid>
        <Paper>
          <ReactMarkdown source={code}>{code}</ReactMarkdown>
        </Paper>
      </Grid>

      <SimpleSnackbar
        snackBarOpen={snackBarOpen}
        warningMessage={warningMessage}
        severity={severity}
        handleSnackBarClose={handleSnackBarClose}
      />
    </Grid>
  );
}
