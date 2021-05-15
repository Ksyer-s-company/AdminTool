import React, { useEffect, useCallback, makeStyles, useState, Fragment } from 'react';
import { observer } from 'mobx-react';
import { serverConfig } from '../../config';
import { Grid, Paper } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import SimpleSnackbar from '../SimpleSnackbar';
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

  useEffect(() => {
    let initUrl = new URL('/api/beijinghua', serverConfig.baseUrl);
    axios({
      method: 'GET',
      url: initUrl,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }, []);

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
    <Grid container direction="row" spacing={5}>
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
      <Grid item>
        {outputStr ? (
          <Grid>
            <br />
            <div>{outputStr}</div>
            <br />
            <CopyToClipboard text={outputStr} onCopy={() => setCopied(true)}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={() => {
                  setSnackBarOpen(true);
                  setWarningMessage('复制成功');
                  setSeverity('success');
                }}
              >
                复制到剪切板
              </Button>
            </CopyToClipboard>
          </Grid>
        ) : (
          <div></div>
        )}
      </Grid>
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
