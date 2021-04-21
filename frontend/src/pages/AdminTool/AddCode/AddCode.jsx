import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import { Grid, TextField } from '@material-ui/core';
import { rawArticleApi } from '../../../apis/RawArticleApi';
import { forEach, set } from 'lodash';
import { serverConfig } from '../../../config';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import SimpleSnackbar from '../SimpleSnackbar';
import { isEmptyObject } from 'jquery';

export default function AddCode() {
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
      if (articleUrlFlag) {
        let postUrl = new URL('/api/code_saver', serverConfig.baseUrl);
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
      } else {
        let postUrl = new URL('/api/code_displayer', serverConfig.baseUrl);
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
            console.log(data);
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
    }
  };

  return (
    <div>
      <Grid>
        <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
          <Button
            onClick={() => {
              setArticleUrlFlag(true);
              setCode('');
              setID('');
            }}
            color={articleUrlFlag ? 'primary' : 'black'}
          >
            代码暂存
          </Button>
          <Button
            onClick={() => {
              setArticleUrlFlag(false);
              setCode('');
              setID('');
            }}
            color={articleUrlFlag ? 'black' : 'primary'}
          >
            查看暂存代码
          </Button>
        </ButtonGroup>
      </Grid>
      <br />

      <form onSubmit={addCode}>
        <Grid>
          {articleUrlFlag ? (
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
          ) : (
            <Grid>
              <div>
                <TextField
                  type="input"
                  label="ID"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={ID}
                  onChange={(e) => setID(e.target.value)}
                />
              </div>
            </Grid>
          )}
        </Grid>

        <SimpleSnackbar
          snackBarOpen={snackBarOpen}
          warningMessage={warningMessage}
          severity={severity}
          handleSnackBarClose={handleSnackBarClose}
        />
        <Grid>
          <div>
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              提交
            </Button>
            {loading && <CircularProgress size={24} />}
          </div>
        </Grid>

        <br />
        {articleUrlFlag ? <div>{ID}</div> : <div>{code}</div>}
      </form>
    </div>
  );
}
