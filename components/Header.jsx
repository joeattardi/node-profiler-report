import React from 'react';
import styled from 'styled-components';

const Header = styled.header`
  background: #604D2D;
  color: #FFFFFF;
  padding: 0.5em;

  h1 {
    margin: 0;
  }
`;

export default ({ generatedTime }) => (
  <Header>
    <h1>Profiler Report</h1>
    <div>Generated {generatedTime}</div>
  </Header>
);
