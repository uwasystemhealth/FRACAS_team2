import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackbarAlertProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}



const SnackbarAlert: React.FC<SnackbarAlertProps> = ({ open, message, severity, onClose }) => {
    
    if (severity == 'success' || severity == 'info') {
        console.log(message)
    } else if (severity == 'warning') {
        console.warn(message)
    } else if (severity == 'error') {
        console.error(message)
    }
    
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
