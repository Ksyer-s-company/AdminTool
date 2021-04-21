import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { serverConfig } from '../../../config';
import Button from '@material-ui/core/Button';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import SimpleSnackbar from './SimpleSnackbar';
import axios from 'axios';
import FileTable from './FileTable';

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

export default function FormUpload() {
  const classes = useStyles();
  const [warningMessage, setWarningMessage] = useState('init');
  const [severity, setSeverity] = useState('info');
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileNames, setFileNames] = useState([]);

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  };

  const submit = (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);

    let url = new URL('/api/upload_file', serverConfig.baseUrl);
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
        const status_code = parseInt(response.data.status_code);

        switch (status_code) {
          case 200:
            warningMessage = response.data.filename + '上传成功';
            severity = 'success';
            fileName = response.data.filename;
            break;
          case 404:
            warningMessage = '未上传文件';
            severity = 'error';
            break;
          case 500:
            warningMessage = '文件格式错误';
            severity = 'error';
            fileName = response.data.filename;
            break;
          default:
            warningMessage = '系统错误';
            severity = 'error';
        }
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
        if (severity == 'success') location.reload();
      });
  };

  const handleSelectFile = (e) => {
    var filePath = e.target.value.split('\\');
    var fileName = filePath.slice(-1)[0];
    setFileName(fileName);
  };

  const handleDownload = (e) => {
    let formData = new FormData();
    var filename = e;
    formData.append('filename', filename);

    let url = new URL('/api/download_file', serverConfig.baseUrl);
    axios({
      method: 'POST',
      url: url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer',
    }).then((e) => {
      var buff = e.data;
      let url = window.URL.createObjectURL(new Blob([buff], { type: 'arraybuffer' }));
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <Grid>
      <FileTable handleDownload={handleDownload}></FileTable>

      <br />

      <form onSubmit={submit}>
        <Grid spaceing={2} container direction="row" justify="flex-start" alignItems="flex-start">
          <Grid item xs={3}>
            <label htmlFor="file">
              <input
                name="file"
                accept="*"
                className={classes.input}
                id="file"
                multiple
                type="file"
                onChange={handleSelectFile}
              />
              <Button color="primary" variant="contained" component="span">
                选择文件
              </Button>
            </label>
            {fileName ? '    ' + fileName : ''}
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" color="primary" type="submit" id="btnSave">
              提交
            </Button>
          </Grid>
        </Grid>
      </form>

      <SimpleSnackbar
        snackBarOpen={snackBarOpen}
        warningMessage={warningMessage}
        severity={severity}
        handleSnackBarClose={handleSnackBarClose}
      />
    </Grid>
  );
}
