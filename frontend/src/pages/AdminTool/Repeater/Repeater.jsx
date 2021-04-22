import React, { useEffect, useCallback, useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import { serverConfig } from '../../../config';
import { Grid, Paper } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import SimpleSnackbar from '../SimpleSnackbar';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import imgSe from '../Repeater/se.png';
import imgTianPing from '../Repeater/tianping.png';

const SquarePaper = (props) => <Paper square {...props} />;

const Repeater = observer(() => {
  const imgStyles = makeStyles((theme) => ({
    logo: {
      height: '1.5rem',
      marginRight: theme.spacing(1),
      marginTop: -8,
    },
  }));

  const img_classes = imgStyles();
  const [inputStr, setInputStr] = useState('');
  const [emoji, setEmoji] = useState('selectWechat');
  const [outputStr, setOutputStr] = useState('');

  const [warningMessage, setWarningMessage] = useState('init');
  const [severity, setSeverity] = useState('info');
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let initUrl = new URL('/api/repeater', serverConfig.baseUrl);
    axios({
      method: 'GET',
      url: initUrl,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }, []);

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  };

  const handleChange = (e) => {
    setEmoji(e.target.value);
  };

  const submit = (e) => {
    e.preventDefault();

    let url = new URL('/api/repeater', serverConfig.baseUrl);

    let formData = new FormData();
    formData.append('input_str', inputStr);
    formData.append('emoji', emoji);

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
    <Grid container direction="row" spacing={3}>
      <Grid item>
        <form onSubmit={submit}>
          <Grid spacing={3}>
            <Grid item>
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
                  setInputStr(e.target.value);
                }}
              />
            </Grid>

            <br />
            <Grid item>
              <FormControl component="fieldset">
                <FormLabel component="legend">表情</FormLabel>
                <RadioGroup aria-label="emoji" name="emoji" value={emoji} onChange={handleChange}>
                  <FormControlLabel value="selectWechat" control={<Radio />} label="微信">
                    {' '}
                  </FormControlLabel>
                  <FormControlLabel value="selectEmoji" control={<Radio />} label="😍" />
                  <FormControlLabel
                    value="selectWeiboSe"
                    control={<Radio />}
                    label={<img src={imgSe} className={img_classes.logo} />}
                  ></FormControlLabel>
                  <FormControlLabel
                    value="selectWeiboTianping"
                    control={<Radio />}
                    label={<img src={imgTianPing} className={img_classes.logo} />}
                  ></FormControlLabel>
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item>
              <label htmlFor="contained-button-file">
                <div>
                  <Button variant="contained" color="primary" type="submit">
                    提交
                  </Button>
                </div>
              </label>
            </Grid>
          </Grid>
        </form>
      </Grid>{' '}
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

export default Repeater;
