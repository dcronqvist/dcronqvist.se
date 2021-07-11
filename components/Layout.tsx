import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import styles from '../styles/layout.module.css'
import NavLink from '../components/NavLink'

type Props = {
  children?: ReactNode
  title?: string
  currentNav?: string
}

const Layout = ({ children, title = 'This is the default title', currentNav }: Props) => (
  <div className={styles.layout}>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header className={styles.header}>
      <h1>
      daniel cronqvist
      </h1>
      <nav>
        <NavLink title="about me" href="/" at={currentNav == "about me"}/>
        <NavLink title="projects" href="/projects" at={currentNav == "projects"}/>
        <NavLink title="resume" href="/resume" at={currentNav == "resume"}/>
      </nav>
    </header>
    <main className={styles.main}>
      {children}
    </main>
  </div>
)

export default Layout
