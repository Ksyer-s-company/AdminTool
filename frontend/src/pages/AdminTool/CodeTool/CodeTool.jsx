import React, { useEffect, useState } from 'react';
import { Grid, TextField, Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import UploadCode from './UploadCode';
import DownloadCode from './DownloadCode';

export default function CodeTool() {
  const [loading, setLoading] = useState(false);
  const [articleUrlFlag, setArticleUrlFlag] = useState(true);

  const [code, setCode] = useState('');
  const [ID, setID] = useState('');

  return (
    <Grid>
      <Grid>
        <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
          <Button
            onClick={() => {
              setArticleUrlFlag(true);
              setCode('');
              setID('');
            }}
            color={articleUrlFlag ? 'primary' : 'black'}
          >
            代码暂存
          </Button>
          <Button
            onClick={() => {
              setArticleUrlFlag(false);
              setCode('');
              setID('');
            }}
            color={articleUrlFlag ? 'black' : 'primary'}
          >
            查看暂存代码
          </Button>
        </ButtonGroup>
      </Grid>

      {articleUrlFlag ? <UploadCode /> : <DownloadCode />}
    </Grid>
  );
}
