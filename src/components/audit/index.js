import React from 'react';
import styled from 'styled-components'
import { format } from 'date-fns'

export default ({ messages }) => (
  <AuditBox>
    {
      messages && messages.length 
      ? messages.map(message => (
        <a
          key={message.ts}
          href={`https://devnet.thetangle.org/address/${message.address}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Log>
            <span>{format(message.ts, 'HH:mm:ss')}</span>
            <span>{`Temperature: ${message.t}`}</span>
            <span>{`Gradient: ${message.g}`}</span>
          </Log>
        </a>
        ))
      : (<Log>No messages yet</Log>)
    }
  </AuditBox>
)

const Log = styled.span`
  font-family: monospace;
  opacity: ${props => (props.pending ? 0.6 : 1)};
  margin: 0.3rem 0;
  padding: 0 0 0.5rem;
  font-size: 14px;
  width: 100%;
  display: flex;
  flex-direction: row;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  justify-content: space-around;
  @media screen and (max-width: 800px) {
    font-size: 12px;
    flex-wrap: wrap;
  }
`

const AuditBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 1.5rem 1.5rem;
  border-top: ${props => (props.top ? '1px solid rgba(0,0,0,0.1)' : null)};
`
