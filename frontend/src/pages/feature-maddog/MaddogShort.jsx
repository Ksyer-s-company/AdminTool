import React, { useState } from 'react';
import { Grid, TextField, Paper } from '@material-ui/core';
import { serverConfig } from '../../config';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import SimpleSnackbar from '../SimpleSnackbar';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function MaddogShort() {
  const [loading, setLoading] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const [inputStr, setInputStr] = useState('');
  const [result, setResult] = useState('');

  const [warningMessage, setWarningMessage] = useState('init');
  const [severity, setSeverity] = useState('info');

  const isEmpty = (code) => {
    if (code == '') return false;
    return true;
  };

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  };

  const getShort = (e) => {
    e.preventDefault();

    // Props of SimpleSnackbar
    var tempWarningMessage = '';
    var tempSeverity = '';
    var tempLoading = true;
    var tempCode = '';
    var tempResult = '';

    setLoading(loading);

    var emptyFlag = isEmpty(inputStr);

    if (!emptyFlag) {
      tempWarningMessage = '所填内容不能为空';
      tempSeverity = 'error';
      setWarningMessage(tempWarningMessage);
      setSeverity(tempSeverity);
      setLoading(false);
      setSnackBarOpen(true);
    } else {
      let postUrl = new URL('/api/maddog', serverConfig.baseUrl);
      let formData = new FormData();
      formData.append('size', 'short');
      formData.append('input_str', inputStr);

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
          tempResult = data['output_str'];
        })
        .catch(function (e) {
          console.log('error: ', e);
          tempWarningMessage = '系统错误';
          tempSeverity = 'error';
          tempLoading = false;
        })
        .finally(() => {
          if (!emptyFlag) loading = false;
          setWarningMessage(tempWarningMessage);
          setSeverity(tempSeverity);
          setLoading(tempLoading);
          setSnackBarOpen(true);
          setResult(tempResult);
        });
    }
  };

  const [copied, setCopied] = useState(false);

  return (
    <Grid>
      <form onSubmit={getShort}>
        <br />
        我真的想___想得要发疯了。我躺在床上会想___，我吃饭会想___，我上厕所会想___，我洗澡会想___，我出门会想___，我走路会想___，我坐车会想___，我上课会想___，我玩手机会想___。我盯着路边的___看我盯着马路对面的___看我盯着地铁里的___看，我盯着朋友圈别人合照里的___看，我每时每刻眼睛都直直地盯着___看
        <div>
          <TextField
            type="input"
            id="inputContent"
            name="inputContent"
            label="请输入要填入的文本"
            placeholder=""
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={inputStr}
            onChange={(e) => setInputStr(e.target.value)}
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

      <Grid item>
        {result ? (
          <Grid>
            <br />
            <div>{result}</div>
            <br />
            <CopyToClipboard text={result} onCopy={() => setCopied(true)}>
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
}
