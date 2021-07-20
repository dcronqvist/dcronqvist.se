import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import styles from '../styles/layout.module.css'
import NavLink from '../components/NavLink'
import { Icon, InlineIcon } from '@iconify/react';
import linkedinIcon from '@iconify/icons-mdi/linkedin';
import githubIcon from '@iconify/icons-mdi/github'
import mailIcon from '@iconify/icons-mdi/email'
import Tooltipped from '../components/Tooltipped'

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
      <Link href="/">
        <a>
          <h1>daniel cronqvist.</h1>
        </a>
      </Link>
      <nav>
        <NavLink title="projects" href="/projects" at={currentNav == "projects"}/>
        <NavLink title="articles" href="/articles" at={currentNav == "articles"}/>
        <NavLink title="who's daniel?" href="/aboutme" at={currentNav == "who's daniel?"}/>
      </nav>
      <div className={styles.links}>
        <a href="https://www.linkedin.com/in/dcronqvist/" target="_blank">
          <Icon height={40} icon={linkedinIcon}/>
        </a>
        <Tooltipped text="Follow me on GitHub!">
          <a href="https://github.com/dcronqvist" target="_blank">
            <Icon height={40} icon={githubIcon}/>
          </a>
        </Tooltipped>
        <Tooltipped text="Want to get in touch?">
          <a href="mailto:daniel@dcronqvist.se" target="_blank">
            <Icon height={40} icon={mailIcon}/>
          </a>
        </Tooltipped>
      </div>
    </header>
    <main className={styles.main}>
      {children}
    </main>
  </div>
)

export default Layout
