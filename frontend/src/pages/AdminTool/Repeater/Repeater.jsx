import React, { useEffect, useCallback, makeStyles, useState, Fragment } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction, toJS } from 'mobx';
import { serverConfig } from '../../../config';
import { Grid, Paper } from '@material-ui/core';
// import { dataDetailsApi } from '../../../apis/DataMonitorApi';
import { StyledTableCell, StyledTableRow } from '../ArticleAdmin/ArticleTable';
import { history } from '../../../App';
import { useParams } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import { Switch, Redirect, Route, useRouteMatch } from 'react-router-dom';

const SquarePaper = (props) => <Paper square {...props} />;

const Repeater = observer(() => {
  const [dataD, setDataD] = useState('');
  const [inputStr, setInputStr] = useState('');

  const submit = (e) => {
    e.preventDefault();

    let url = new URL('/api/repeater/', serverConfig.baseUrl);

    let formData = new FormData();
    formData.append('input_str', inputStr);

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
        console.log(data);
        setDataD(data);
      })
      .catch((e) => {
        console.log('error: ', e);
      });
  };

  return (
    <Grid>
      <Grid item>
        <form onSubmit={submit}>
          <TextField
            type="input"
            id="input_str"
            name="input_str"
            label="请输入要转换的文本"
            placeholder="肖战"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={inputStr}
            onChange={(e) => {
              setEndTime(e.target.value);
            }}
          />
          <Grid>
            <label htmlFor="contained-button-file">
              <div>
                <Button variant="contained" color="primary" type="submit">
                  提交
                </Button>
              </div>
            </label>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
});

export default Repeater;
