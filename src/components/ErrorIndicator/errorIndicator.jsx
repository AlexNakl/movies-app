import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import './errorIndicator.css';

function ErrorIndicator({ errorText }) {
  return <Alert message="Error" description={errorText} type="error" showIcon />;
}

ErrorIndicator.defaultProps = {
  errorText: '',
};

ErrorIndicator.propTypes = {
  errorText: PropTypes.string,
};

export default ErrorIndicator;
