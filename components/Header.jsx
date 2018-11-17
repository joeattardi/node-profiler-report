import React from 'react';
import styled from 'styled-components';

const StyledHeader = styled.header`
  background: #604D2D;
  color: #FFFFFF;
  padding: 0.5em;

  h1 {
    margin: 0;
  }
`;

const Header = ({ generatedTime }) => (
  <StyledHeader>
    <h1>Profiler Report</h1>
    <div>Generated {generatedTime}</div>
  </StyledHeader>
);

export default Header;