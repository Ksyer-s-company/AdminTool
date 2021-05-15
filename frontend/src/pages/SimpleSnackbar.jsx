import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SimpleSnackbar = observer((props) => {
  const { snackBarOpen, handleSnackBarClose, severity, warningMessage } = props;
  return (
    <Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handleSnackBarClose}>
      <Alert severity={severity}>{warningMessage}</Alert>
    </Snackbar>
  );
});

export default SimpleSnackbar;
