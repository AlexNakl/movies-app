import React from 'react';
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
export default Paginator;
