import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const StyledNav = styled.nav`
  padding: 1em;
  background: #988b76;
`;

const StyledLink = styled(NavLink)`
  text-decoration: none;
  display: block;
  margin: 0.5em;
  padding: 0.5em;
  border: 3px solid #ffffff;
  border-radius: 5px;
  color: #ffffff;
  font-weight: bold;
  transition: background-color   0.2s;

  &:hover {
    background: #ada291;
  }

  &.active {
    background: #ffffff;
    color: #988b76;
  }
`;

const Nav = ({ keys }) => (
  <StyledNav>
    {keys.map(key => (
      <StyledLink key={key} to={`/data/${key}`}>{key}</StyledLink>
    ))}
    <StyledLink to="/rawData">Raw data</StyledLink>
  </StyledNav>
);

export default Nav;
