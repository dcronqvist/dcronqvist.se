import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import styles from '../styles/navlink.module.css'
import { useTheme } from '../contexts/ThemeContext'

type Props = {
  children?: ReactNode
  title?: string
  href?: string
  at?: boolean
}


const NavLink = ({ children, title = 'This is the default title', href, at }: Props) => {
  const { theme } = useTheme()


  return (
  <span className={ at ? `${theme.navlink.link} ${theme.navlink.underlined}` : theme.navlink.link }>
    <Link href={href}>
      <a>{title}</a>
    </Link>
  </span>
)}
  
export default NavLink
  