import React, { ReactNode } from 'react'
import Link from 'next/link'
import { useTheme, Theme } from '../contexts/ThemeContext'
import styled from 'styled-components'

type Props = {
  children?: ReactNode
  title?: string
  href?: string
  at?: boolean
}

const NavLinkWrapper = styled.span<{ underlined: boolean; theme: Theme }>`
  font-family: 'Roboto', sans-serif;
  margin: 2px;
  background-color: ${(props) => props.theme.primaryDark};
  border: 1px solid ${(props) => props.theme.primaryLight};
  border-radius: 3px;
  padding: 5px;
  transition: all 0.2s ease;
  font-weight: 400;
  font-size: 22px;
  text-decoration: ${(props) => (props.underlined ? 'underline' : 'none')};
  color: ${(props) => props.theme.onPrimary};

  &:hover {
    background-color: ${(props) => props.theme.primaryLight};
    border: 1px solid ${(props) => props.theme.primaryDark};
    cursor: pointer;
  }

  &:hover a {
    color: ${(props) => props.theme.linkHover};
  }

  @media (min-width: 320px) {
    font-size: 18px;
  }
`

const NavLink = ({
  title = 'This is the default title',
  href,
  at
}: Props): JSX.Element => {
  const { theme } = useTheme()

  return (
    <Link passHref={true} href={href}>
      <NavLinkWrapper underlined={at} theme={theme}>
        <a>{title}</a>
      </NavLinkWrapper>
    </Link>
  )
}

export default NavLink
