import React from 'react';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { data } from 'data';

const DataSection = ({ match }) => (
  <div>
    <h2>{match.params.name}</h2>
    <ReactTable
      data={data[match.params.name]}
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

export default DataSection;
