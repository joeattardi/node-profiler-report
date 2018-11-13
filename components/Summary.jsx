import React from 'react';

export default ({ summary }) => (
  <div>
    <h2>Summary</h2>
    <table>
      <tr>
        <th>ticks</th>
        <th>total</th>
        <th>nonlib</th>
        <th>name</th>
      </tr>
      {summary.map(renderRow)}
    </table>
  </div>
);

function renderRow(rowData) {
  return (
    <tr>
      <td>{rowData.ticks}</td>
      <td>{rowData.total}</td>
      <td>{rowData.nonlib}</td>
      <td>{rowData.name}</td>
    </tr>
  );
}
