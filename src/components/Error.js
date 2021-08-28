import React from 'react';
import Alert from '@material-ui/lab/Alert';

const Error = ({ type, message }) => {
  return (
    <div>
        <Alert
        style={{ width: '50%', margin: '0 auto', marginTop: '20px' }}
        severity={type}>
        {message}
      </Alert>
    </div>
  );
};

export default Error;
