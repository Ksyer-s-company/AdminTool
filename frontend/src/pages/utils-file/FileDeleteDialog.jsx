import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FileDeleteDialog(props) {
  const { handleDelete, filename } = props;
  const [formDialogOpen, setFormDialogOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleFormDialogOpenClose = () => {
    setFormDialogOpen(false);
  };

  const verify = () => {
    if (password === '123') {
      setPasswordError(false);
      handleDelete(filename);
      setFormDialogOpen(false);
    } else {
      setPasswordError(true);
    }
  };

  return (
    <Dialog
      open={formDialogOpen}
      onClose={handleFormDialogOpenClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">请输入密码</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
        <TextField
          autoFocus
          error={passwordError}
          margin="dense"
          id="password"
          label="Password"
          type="password"
          helperText={passwordError ? '密码错误，请重试。' : ''}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleFormDialogOpenClose} color="primary">
          Cancel
        </Button>
        <Button onClick={verify} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
