import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { action, observable, runInAction } from 'mobx';
import { Grid, TextField } from '@material-ui/core';
import { rawArticleApi } from '../../../apis/RawArticleApi';
import { forEach, set } from 'lodash';
import { serverConfig } from '../../../config';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import SimpleSnackbar from './SimpleSnackbar';
import { isEmptyObject } from 'jquery';

export default function AddArticle() {
  const [loading, setLoading] = useState(false);
  const [articleUrlFlag, setArticleUrlFlag] = useState(true);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [html, setHTML] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [source, setSource] = useState('wechat');

  const [warningMessage, setWarningMessage] = useState('init');
  const [severity, setSeverity] = useState('info');

  const isEmpty = (articleUrlFlag, url, text, html, title, author) => {
    if (articleUrlFlag && url == '') return false;
    var isEmptyFlag = (url == '' || title == '' || author == '') && (text != '' || html != '');
    if (!articleUrlFlag && isEmptyFlag) return false;
    return true;
  };

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
  };

  const addArticleSubmit = (e) => {
    e.preventDefault();

    // Props of SimpleSnackbar
    var warningMessage = '';
    var severity = '';
    var loading = true;

    setLoading(loading);

    var emptyFlag = isEmpty(articleUrlFlag, url, text, html, title, author, source);

    if (!emptyFlag) {
      warningMessage = '所填内容不能为空';
      severity = 'error';
      setWarningMessage(warningMessage);
      setSeverity(severity);
      setLoading(false);
      setSnackBarOpen(true);
    } else {
      let post_url = new URL('/api/alter-wechat-article/', serverConfig.baseUrl);
      let formData = new FormData();

      formData.append('url', url);
      formData.append('text', text);
      formData.append('html', html);
      formData.append('title', title);
      formData.append('author', author);
      formData.append('source', source);

      axios({
        method: 'POST',
        url: post_url,
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
          if (!emptyFlag) loading = false;
          setWarningMessage(warningMessage);
          setSeverity(severity);
          setLoading(loading);
          setSnackBarOpen(true);
          if (severity == 'success') location.reload();
        });
    }
  };

  return (
    <div>
      <Grid>
        <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
          <Button
            onClick={() => {
              setArticleUrlFlag(true);
              setAuthor('');
              setTitle('');
              setUrl('');
              setText('');
              setHTML('');
            }}
            color={articleUrlFlag ? 'primary' : 'black'}
          >
            通过url添加
          </Button>
          <Button
            onClick={() => {
              setArticleUrlFlag(false);
              setUrl('');
            }}
            color={articleUrlFlag ? 'black' : 'primary'}
          >
            手动添加
          </Button>
        </ButtonGroup>
      </Grid>
      <br />

      <form onSubmit={addArticleSubmit}>
        <Grid>
          {articleUrlFlag ? (
            <div>
              <TextField
                type="input"
                id="inputContent"
                name="inputContent"
                label="url"
                placeholder="https://"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <TextField
                type="input"
                label="作者"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
              <br />
              <TextField
                type="input"
                label="标题"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <br />
              <TextField
                type="input"
                label="url"
                placeholder="https://"
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <TextField
                type="input"
                label="原文内容"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <TextField
                type="input"
                label="原文HTML"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                value={html}
                onChange={(e) => setHTML(e.target.value)}
              />
            </div>
          )}
        </Grid>

        <SimpleSnackbar
          snackBarOpen={snackBarOpen}
          warningMessage={warningMessage}
          severity={severity}
          handleSnackBarClose={handleSnackBarClose}
        />
        <Grid>
          <div>
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              提交
            </Button>
            {loading && <CircularProgress size={24} />}
          </div>
        </Grid>
      </form>
    </div>
  );
}
