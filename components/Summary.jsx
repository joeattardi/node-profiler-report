import React from 'react';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default ({ summary }) => (
  <div>
    <h2>Summary</h2>
    <ReactTable
      data={summary}
      minRows={0}
      columns={[
        {
          Header: 'Ticks',
          accessor: 'ticks',
          width: 150
        },
        {
          Header: 'Total',
          accessor: 'total',
          Cell: percentFormatter,
          width: 150
        },
        {
          Header: 'Non-Library',
          accessor: 'nonlib',
          Cell: percentFormatter,
          width: 150
        },
        {
          Header: 'Name',
          accessor: 'name'
        }
      ]}
      defaultSorted={[
        {
          id: 'ticks',
          desc: true
        }
      ]}
    />
  </div>
);

function percentFormatter(data) {
  return <span>{data.value}%</span>;
}
