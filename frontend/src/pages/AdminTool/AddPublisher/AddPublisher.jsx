import React, { Component, useRef, useState } from 'react';
import { serverConfig } from '../../../config';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Checkbox, FormControlLabel } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import SimpleSnackbar from './SimpleSnackbar';
import axios from 'axios';
import PublisherTable from './PublisherTable';
import { fromPairs } from 'lodash';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '50%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function AddPublisher() {
  const classes = useStyles();
  const [accountId, setAccountId] = useState('');
  const [isBroker, setIsBroker] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [active, setActive] = useState(true);
  const [warningMessage, setWarningMessage] = useState('init');
  const [severity, setSeverity] = useState('info');
  const [loading, setLoading] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [id, setId] = useState(0);

  const submit = (e) => {
    e.preventDefault();
    var validFlag = true;
    var warningMessage = '';
    var severity = '';
    var loading = true;
    setLoading(true);
    if (accountId == '' || displayName == '') validFlag = false;
    // 输入不合法
    if (!validFlag) {
      warningMessage = '微信号或公众号名称不能为空';
      severity = 'error';
      setWarningMessage(warningMessage);
      setSeverity(severity);
      setLoading(false);
      setSnackBarOpen(true);
    } else {
      let url = new URL('/api/alter-wechat-publisher/', serverConfig.baseUrl);
      let formData = new FormData();

      formData.append('account_id', accountId);
      formData.append('is_broker', isBroker);
      formData.append('display_name', displayName);
      formData.append('active', active);
      formData.append('name', update ? '' : displayName);
      formData.append('id', id);

      axios({
        method: 'POST',
        url: url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((response) => response.data)
        .then((data) => {
          data = JSON.parse(data);
          switch (data['code']) {
            case 201:
              warningMessage = '添加成功';
              severity = 'success';
              loading = false;
              break;
            case 400:
              warningMessage = (update ? '更新' : '新增') + '失败，微信号已存在';
              severity = 'warning';
              loading = false;
              break;
            case 503:
              warningMessage = (update ? '更新' : '新增') + '失败，系统错误';
              severity = 'warning';
              loading = false;
              break;
            case 202:
              warningMessage = '更新成功';
              severity = 'success';
              loading = false;
              break;
            default:
              warningMessage = '系统错误';
              severity = 'error';
              loading = false;
          }
        })
        .catch(function (e) {
          console.log('error: ', e);
          warningMessage = '系统错误';
          severity = 'error';
          loading = false;
        })
        .finally(() => {
          if (!validFlag) loading = false;
          setWarningMessage(warningMessage);
          setSeverity(severity);
          setLoading(loading);
          setSnackBarOpen(true);
          if (severity == 'success') location.reload();
        });
    }
  };

  const handleUpdate = (user) => {
    setAccountId(user.account_id);
    setActive(user.active);
    setDisplayName(user.display_name);
    setIsBroker(user.is_broker);
    setId(user.id);
    setUpdate(true);
  };

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  };

  return (
    <div>
      <Grid container direction="row" justify="space-between">
        <Grid item>
          <form onSubmit={submit}>
            <Grid container direction="column" justify="space-evenly" alignItems="stretch">
              <TextField
                type="input"
                accountId={accountId}
                id="accountId"
                name="accountId"
                label="微信号"
                placeholder="stockchuan"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                value={accountId}
                onChange={(e) => {
                  setAccountId(e.target.value);
                }}
              />
              <br />
              <TextField
                type="input"
                displayName={displayName}
                id="displayName"
                name="displayName"
                label="公众号名称"
                placeholder="股海有川"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                }}
              />
              <br />
              <Grid>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isBroker"
                      id="isBroker"
                      checked={isBroker}
                      onChange={(e) => {
                        setIsBroker(e.target.checked);
                      }}
                    />
                  }
                  label="是否为券商"
                />
              </Grid>
              <Grid>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="active"
                      id="active"
                      checked={active}
                      onChange={(e) => {
                        setActive(e.target.checked);
                      }}
                    />
                  }
                  label="是否使用"
                />
              </Grid>
              <br />
              <Grid>
                <label htmlFor="contained-button-file">
                  <div>
                    <Button variant="contained" color="primary" type="submit" disabled={loading}>
                      提交
                    </Button>
                    {loading && <CircularProgress size={24} />}
                  </div>
                </label>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <SimpleSnackbar
          snackBarOpen={snackBarOpen}
          warningMessage={warningMessage}
          severity={severity}
          handleSnackBarClose={handleSnackBarClose}
        />
        <Grid style={{ maxHeight: 700, overflow: 'auto' }}>
          <PublisherTable handleUpdate={handleUpdate} />
        </Grid>
      </Grid>
    </div>
  );
}
