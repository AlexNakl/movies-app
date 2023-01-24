import React from 'react';
import { Alert } from 'antd';
import './errorIndicator.css';

function ErrorIndicator({ errorText }) {
  return <Alert message="Error" description={errorText} type="error" showIcon />;
}

export default ErrorIndicator;
