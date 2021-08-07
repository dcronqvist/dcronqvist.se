import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import styles from '../styles/navlink.module.css'
import { useTheme, Theme } from '../contexts/ThemeContext'
import styled from 'styled-components'

type Props = {
  children?: ReactNode
  title?: string
  href?: string
  at?: boolean
}

const NavLinkWrapper = styled.span<{underlined: boolean, theme: Theme}>`
  margin: 1.5vw;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 1.9vw;
  text-decoration: ${props => props.underlined ? 'underline' : 'none'};
  color: ${props => props.theme.onPrimary};
`

const NavLink = ({ children, title = 'This is the default title', href, at }: Props) => {
  const { theme } = useTheme()

  return (
    <NavLinkWrapper underlined={at}>
      <Link href={href}>
        <a>{title}</a>
      </Link>
    </NavLinkWrapper>
)}
  
export default NavLink
  