import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import MaddogShort from './MaddogShort';
import MaddogLong from './MaddogLong';

export default function Maddog() {
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
            短的
          </Button>
          <Button
            onClick={() => {
              setArticleUrlFlag(false);
              setCode('');
              setID('');
            }}
            color={articleUrlFlag ? 'black' : 'primary'}
          >
            长的
          </Button>
        </ButtonGroup>
      </Grid>

      {articleUrlFlag ? <MaddogShort /> : <MaddogLong />}
    </Grid>
  );
}
