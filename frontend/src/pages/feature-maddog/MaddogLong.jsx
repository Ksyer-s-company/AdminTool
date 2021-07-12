import React, { useState } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { serverConfig } from '../../config';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import SimpleSnackbar from '../SimpleSnackbar';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function MaddogLong() {
  const [loading, setLoading] = useState(false);
  const [articleUrlFlag, setArticleUrlFlag] = useState(true);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const [inputStr1, setInputStr1] = useState('');
  const [inputStr2, setInputStr2] = useState('');
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

  const getLong = (e) => {
    e.preventDefault();

    // Props of SimpleSnackbar
    var tempWarningMessage = '';
    var tempSeverity = '';
    var tempLoading = true;
    var emptyFlag = isEmpty(inputStr1 + inputStr2);
    var tempResult = '';

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
        let postUrl = new URL('/api/maddog', serverConfig.baseUrl);
        let formData = new FormData();

        formData.append('size', 'long');
        formData.append('input_str', inputStr1 + '|||||' + inputStr2);

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
    }
  };

  const [copied, setCopied] = useState(false);

  return (
    <Grid>
      <form onSubmit={getLong}>
        <br />
        现在是__月__日__:__，__1__情绪发作最严重的一次，躺在床上，拼命念大悲咒，难受的一直抓自己眼睛，以为刷微博没事，看到微博到处都有__2__，眼睛越来越大都要炸开了一样，拼命扇自己，越扇越用力，扇到自己眼泪流出来，真的不知道该怎么办，我真的__1___得要发疯了！我躺在床上会有__1__情绪，我洗澡会有__1__情绪，我出门会有__1__情绪，我走路会有__1__情绪，我坐车会有__1__情绪，我工作会有__1__情绪，我玩手机会有__1__情绪——我拼命盯着路上的人看，每当用我智慧的双眼判断这个有__2__倾向时，我就控制不住地要去询问别人到底是不是__2__，但当回到家就像现在一样躺在床上发狂，思来想去全是你们这群__2__的错！
        <div>
          <TextField
            type="input1"
            id="inputContent1"
            name="inputContent1"
            label="请输入要填入的文本1"
            placeholder=""
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={inputStr1}
            onChange={(e) => setInputStr1(e.target.value)}
          />
          <br />
          <TextField
            type="input2"
            id="inputContent2"
            name="inputContent2"
            label="请输入要填入的文本2"
            placeholder=""
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={inputStr2}
            onChange={(e) => setInputStr2(e.target.value)}
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
