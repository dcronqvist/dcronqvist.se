import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import styles from '../styles/navlink.module.css'

type Props = {
  children?: ReactNode
  title?: string
  href?: string
  at?: boolean
}


const NavLink = ({ children, title = 'This is the default title', href, at }: Props) => (
  <span className={ at ? `${styles.link} ${styles.underlined}` : styles.link }>
    <Link href={href}>
      <a>{title}</a>
    </Link>
  </span>
)
  
export default NavLink
  