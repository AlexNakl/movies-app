import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';

function Paginator({ usePage, totalResults, onChangePage }) {
  return (
    <Pagination
      showQuickJumper
      showSizeChanger={false}
      pageSize={20}
      defaultCurrent={usePage}
      total={totalResults}
      onChange={(pageNumber) => onChangePage(pageNumber)}
    />
  );
}

Paginator.defaultProps = {
  usePage: 1,
  totalResults: 0,
  onChangePage: () => {},
};

Paginator.propTypes = {
  usePage: PropTypes.number,
  totalResults: PropTypes.number,
  onChangePage: PropTypes.func,
};

export default Paginator;
