import React from 'react';
import { Spin } from 'antd';
import './spinner.css';

function Spinner() {
  return (
    <div className="spinner">
      <Spin size="large" />
    </div>
  );
}

export default Spinner;
