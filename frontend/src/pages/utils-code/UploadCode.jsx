import React, { useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { serverConfig } from '../../config';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import SimpleSnackbar from '../SimpleSnackbar';

export default function UploadCode() {
  const [loading, setLoading] = useState(false);
  const [articleUrlFlag, setArticleUrlFlag] = useState(true);
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

  const addCode = (e) => {
    e.preventDefault();

    // Props of SimpleSnackbar
    var tempWarningMessage = '';
    var tempSeverity = '';
    var tempLoading = true;
    var emptyFlag = isEmpty(code + ID);
    var tempID;

    setLoading(true);

    if (!emptyFlag) {
      tempWarningMessage = '所填内容不能为空';
      tempSeverity = 'error';
      setWarningMessage(tempWarningMessage);
      setSeverity(tempSeverity);
      setLoading(false);
      setSnackBarOpen(true);
    } else {
      if (articleUrlFlag) {
        let postUrl = new URL('/api/upload_code', serverConfig.baseUrl);
        let formData = new FormData();
        formData.append('code', code);

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
            tempID = data['ID'];
          })
          .catch(function (e) {
            console.log('error: ', e);
            tempWarningMessage = '系统错误';
            tempSeverity = 'error';
            tempLoading = false;
            tempID = '';
          })
          .finally(() => {
            if (!emptyFlag) loading = false;
            setWarningMessage(tempWarningMessage);
            setSeverity(tempSeverity);
            setLoading(tempLoading);
            setSnackBarOpen(true);
            setID(tempID);
          });
      }
    }
  };

  return (
    <Grid>
      <form onSubmit={addCode}>
        <div>
          <TextField
            type="input"
            id="inputContent"
            name="inputContent"
            label="code"
            placeholder=""
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            multiline
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
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

      <div>{ID}</div>

      <SimpleSnackbar
        snackBarOpen={snackBarOpen}
        warningMessage={warningMessage}
        severity={severity}
        handleSnackBarClose={handleSnackBarClose}
      />
    </Grid>
  );
}
