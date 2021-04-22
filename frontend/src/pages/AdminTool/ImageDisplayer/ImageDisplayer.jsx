import React, { useEffect, useRef, useState } from 'react';
import { serverConfig } from '../../../config';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
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

export default function ImageDisplayer() {
  const classes = useStyles();
  const [warningMessage, setWarningMessage] = useState('init');
  const [severity, setSeverity] = useState('info');
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [imageBase64, setImageBase64] = useState();
  const [initStatus, setInitStatus] = useState(false);

  const handleSelectFile = (e) => {
    var filePath = e.target.value.split('\\');
    var fileName = filePath.slice(-1)[0];
    setFileName(fileName);
  };

  const imageUpload = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);
    let url = new URL('/api/upload_image', serverConfig.baseUrl);
    var warningMessage, severity, fileName;
    axios({
      method: 'POST',
      url: url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        setImageBase64(response.data.images);
      })
      .catch((e) => {
        console.log('error: ', e);
        warningMessage = '系统错误';
        severity = 'error';
      })
      .finally(() => {
        setWarningMessage(warningMessage);
        setSeverity(severity);
        setSnackBarOpen(true);
        setFileName(fileName);
        if (severity == 'success') setInitStatus(true);
      });
  };

  return (
    <Grid>
      <Grid>
        <img src={imageBase64} />
      </Grid>
      <Grid container direction="row" justify="space-between" alignItems="flex-start">
        <Grid item>
          <form onSubmit={imageUpload}>
            <Grid container direction="row" justify="flex-start" alignItems="flex-start">
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
                {fileName ? fileName : '        '}
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" color="primary" type="submit" id="btnSave">
                  提交
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item>
          <ImageTable />
        </Grid>
      </Grid>
    </Grid>
  );
}
