import React, { ReactNode } from 'react'
import styled from 'styled-components'

type TooltippedProps = {
  text: string
  children: ReactNode
}

const TooltipText = styled.span`
  @media (max-width: 800px) {
    display: none;
  }
`

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;

  & ${TooltipText} {
    opacity: 0;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 100%;
    left: 50%;
    margin-left: -60px;
    font-size: max(0.9vw, 12px);
    transition: opacity 0.1s ease-in;
  }

  & ${TooltipText}::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }

  &:hover ${TooltipText} {
    opacity: 1;
  }
`

const Tooltipped = ({ text, children }: TooltippedProps): JSX.Element => {
  return (
    <>
      <TooltipContainer>
        <TooltipText>{text}</TooltipText>
        <span>{children}</span>
      </TooltipContainer>
    </>
  )
}

export default Tooltipped
