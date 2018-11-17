import React from 'react';
import { MemoryRouter, Route, NavLink } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { data, generatedTime } from 'data';

import Header from './Header';
import Nav from './Nav';
import DataSection from './DataSection';
import RawData from './RawData';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
  }
`;

const Main = styled.main`
  padding: 1em;
  color: gray;
  flex-grow: 1;
  overflow-y: scroll;
`;

const Body = styled.div`
  display: flex;
  flex-grow: 1;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const sections = Object.keys(data);
sections.sort((a, b) => {
  if (a === 'Summary') {
    return -1;
  } else if (b === 'Summary') {
    return 1;
  } else {
    return a.localeCompare(b);
  }
});

const App = () => (
  <MemoryRouter initialEntries={[`/data/${sections[0]}`]}>
    <React.Fragment>
      <GlobalStyle />
      <Wrapper>
        <Header generatedTime={generatedTime.toString()} />
        <Body>
          <Nav keys={sections} />
          <Main>
            <Route path="/data/:name" component={DataSection} />
            <Route path="/rawData" component={RawData} />
          </Main>
        </Body>
      </Wrapper>
    </React.Fragment>
  </MemoryRouter>
);

export default App;
