import React, { useEffect, useCallback, makeStyles, useState, Fragment } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction, toJS } from 'mobx';
import { serverConfig } from '../../../config';
import { Grid, Paper } from '@material-ui/core';
// import { dataDetailsApi } from '../../../apis/DataMonitorApi';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import SimpleSnackbar from '../AddArticle/SimpleSnackbar';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const SquarePaper = (props) => <Paper square {...props} />;

const Beijinghua = observer(() => {
  const [inputStr, setInputStr] = useState('');
  const [outputStr, setOutputStr] = useState('');

  const [warningMessage, setWarningMessage] = useState('init');
  const [severity, setSeverity] = useState('info');
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const [copied, setCopied] = useState(false);

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  };

  const submit = (e) => {
    e.preventDefault();

    let url = new URL('/api/beijinghua', serverConfig.baseUrl);

    let formData = new FormData();
    formData.append('input_str', inputStr);

    var warningMessage;
    var severity;

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
        if (data.data == 'Success') {
          setOutputStr(data.output_str);
        }
        warningMessage = data.message;
        severity = data.severity;
      })
      .catch((e) => {
        console.log('error: ', e);
      })
      .finally(() => {
        setWarningMessage(warningMessage);
        setSeverity(severity);
        setSnackBarOpen(true);
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
            placeholder="你妈死了"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={inputStr}
            onChange={(e) => {
              setInputStr(e.target.value);
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

      {outputStr ? (
        <Grid>
          <br />
          <div>{outputStr}</div>
          <CopyToClipboard text={outputStr} onCopy={() => setCopied(true)}>
            <button>Copy to clipboard with button</button>
          </CopyToClipboard>
        </Grid>
      ) : (
        <div></div>
      )}
      <SimpleSnackbar
        snackBarOpen={snackBarOpen}
        warningMessage={warningMessage}
        severity={severity}
        handleSnackBarClose={handleSnackBarClose}
      />
    </Grid>
  );
});

export default Beijinghua;
