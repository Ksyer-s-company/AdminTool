import React, { useState } from 'react';
import { serverConfig } from '../../config';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import SimpleSnackbar from '../SimpleSnackbar';
import axios from 'axios';
import ImageTable from './ImageTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
    },
  })
);

export default function ImageTool() {
  const classes = useStyles();
  const [warningMessage, setWarningMessage] = useState('init');
  const [severity, setSeverity] = useState('info');
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [imageBase64, setImageBase64] = useState();

  const handleSelectFile = (e) => {
    var filePath = e.target.value.split('\\');
    var fileName = filePath.slice(-1)[0];
    setFileName(fileName);
  };

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  };

  const handleDisplay = (e) => {
    console.log(e);
    let formData = new FormData();
    formData.append('filename', e);
    let url = new URL('/api/display_image', serverConfig.baseUrl);
    var tempWarningMessage;
    var tempSeverity;
    var tempFileName;
    var tempImageBase64;

    axios({
      method: 'POST',
      url: url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        tempImageBase64 = response.data.image;
        tempWarningMessage = response.data.warningMessage;
        tempSeverity = response.data.severity;
        tempFileName = response.data.fileName;
      })
      .catch((e) => {
        console.log('error: ', e);
        tempImageBase64 = '';
        tempWarningMessage = '系统错误';
        tempSeverity = 'error';
      })
      .finally(() => {
        setImageBase64(tempImageBase64);
        setWarningMessage(tempWarningMessage);
        setSeverity(tempSeverity);
        setFileName(tempFileName);
        setSnackBarOpen(true);
      });
  };

  const imageUpload = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    let url = new URL('/api/upload_image', serverConfig.baseUrl);
    var tempWarningMessage;
    var tempSeverity;
    var tempFileName;
    var tempImageBase64;
    axios({
      method: 'POST',
      url: url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        tempImageBase64 = response.data.image;
        tempWarningMessage = response.data.warningMessage;
        tempSeverity = response.data.severity;
        tempFileName = response.data.fileName;
      })
      .catch((e) => {
        console.log('error: ', e);
        tempImageBase64 = '';
        tempWarningMessage = '系统错误';
        tempSeverity = 'error';
      })
      .finally(() => {
        setImageBase64(tempImageBase64);
        setWarningMessage(tempWarningMessage);
        setSeverity(tempSeverity);
        setFileName(tempFileName);
        setSnackBarOpen(true);
        if (tempSeverity == 'success') window.location.reload();
      });
  };

  return (
    <Grid>
      <Grid container direction="row" alignItems="flex-start" spacing={4}>
        <Grid item>
          <Grid container item direction="column" alignItems="flex-start" spacing={4}>
            <Grid item>
              <ImageTable handleDisplay={handleDisplay} />
            </Grid>
            <Grid item>
              <form onSubmit={imageUpload}>
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="flex-start"
                  spacing={2}
                >
                  <Grid item>
                    <label htmlFor="file">
                      <input
                        name="file"
                        accept="image/*"
                        className={classes.input}
                        id="file"
                        multiple
                        type="file"
                        onChange={handleSelectFile}
                      />
                      <Button color="primary" variant="contained" component="span">
                        选择图片
                      </Button>
                    </label>
                    {'   ' + fileName ? fileName : '' + '   '}
                  </Grid>
                  <Grid item xs={2}>
                    <Button variant="contained" color="primary" type="submit" id="btnSave">
                      提交
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
        <br />
        <Grid item>
          <img src={imageBase64} />
        </Grid>
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
