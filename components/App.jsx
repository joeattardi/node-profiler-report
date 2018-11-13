import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import { data, generatedTime } from 'data';
import Header from './Header';
import Summary from './Summary';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
  }
`;

const Main = styled.main`
  padding: 1em;
  color: gray;
`;

export default () => (
  <React.Fragment>
    <GlobalStyle />
    <Header generatedTime={generatedTime.toString()} />
    <Main>
      <Summary summary={data.Summary} />
    </Main>
  </React.Fragment>
);
