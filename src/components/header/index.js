import React from 'react';
import styled from "styled-components"

export default () => <Head>Audit Trail - Dashboard</Head>

const Head = styled.header`
  position: fixed;
  top: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: white;
  background: #1d75bc;
  height: 65px;
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
  z-index: 99;
`
