import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import UploadMarkdown from './UploadMarkdown';
import DownloadMarkdown from './DownloadMarkdown';

export default function MarkdownTool() {
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
            Markdown 解析
          </Button>
          <Button
            onClick={() => {
              setArticleUrlFlag(false);
              setCode('');
              setID('');
            }}
            color={articleUrlFlag ? 'black' : 'primary'}
          >
            查看 Markdown
          </Button>
        </ButtonGroup>
      </Grid>

      {articleUrlFlag ? <UploadMarkdown /> : <DownloadMarkdown />}
    </Grid>
  );
}
