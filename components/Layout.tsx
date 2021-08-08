import React, { ReactNode, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Theme, useTheme } from '../contexts/ThemeContext'
import NavLink from '../components/NavLink'
import { Icon } from '@iconify/react';
import linkedinIcon from '@iconify/icons-mdi/linkedin';
import githubIcon from '@iconify/icons-mdi/github'
import mailIcon from '@iconify/icons-mdi/email'
import Tooltipped from '../components/Tooltipped'
import styled from 'styled-components'

type Props = {
  children?: ReactNode
  title?: string
  currentNav?: string
}

const LayoutWrapper = styled.div<{theme: Theme}>`
  transition: all 0.2s ease;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.onBackground};

  & a:hover {
    color: ${props => props.theme.linkOnHover};
  }
`

const StyledHeader = styled.header<{theme: Theme}>`
  background-color: ${props => props.theme.primary};
  width: 100%;
  color: ${props => props.theme.onPrimary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100000;
  height: 18vh;
  transition: all 0.2s ease;

  & a {
    color: inherit;
    text-decoration: none;
    min-width: fit-content;
  }

  & nav {
    color: inherit;
    height: 100%;
    justify-content:space-evenly;
    align-items: center;
    display: flex;
    z-index: 100000;
  }

  & nav span {
    min-width: fit-content;
  }

  & h1 {
    color: inherit;
    margin-left: 3vw;
    margin-right: 3.2rem;
    min-width: fit-content;
    font-weight: 600;
    font-size: 3.9vw;
    z-index: 100000;
    text-decoration: none;
  }
`

const LinksContainer = styled.div<{theme: Theme}>`
  display: flex;
  margin: 0% 5% 0% 5%;
  align-items: center;

  & svg {
    padding: 0.5rem;
  }

  & a {
    color: ${props => props.theme.onPrimary};
  }
`

const StyledMain = styled.main`
  transition: all 0.2s ease;
`

const ThemeSwitcher = styled.span`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-bottom: 10px;
  font-size: 2rem;
  user-select: none;
  cursor: pointer;
`

const Layout = ({ children, title = 'This is the default title', currentNav }: Props) => {
  const { theme, setThemeName, allThemeNames, currentThemeName, getThemeFromName } = useTheme()
  
  return (
  <LayoutWrapper theme={theme}>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="shortcut icon" href="favicon.ico" />
    </Head>
    <StyledHeader theme={theme}>
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
      <LinksContainer>
        <a href="https://www.linkedin.com/in/dcronqvist/" target="_blank">
          <Icon height={40} icon={linkedinIcon}/>
        </a>
        <Tooltipped text="Follow me!">
          <a href="https://github.com/dcronqvist" target="_blank">
            <Icon height={40} icon={githubIcon}/>
          </a>
        </Tooltipped>
        <Tooltipped text="Get in touch?">
          <a href="mailto:daniel@dcronqvist.se" target="_blank">
            <Icon height={40} icon={mailIcon}/>
          </a>
        </Tooltipped>
        <Tooltipped text="Switch themes!">
          <ThemeSwitcher onClick={() => {
            if (currentThemeName == "light") {
              setThemeName("dark")
            } else {
              setThemeName("light")
            }
          }}>
            {theme.emoji}
          </ThemeSwitcher>
        </Tooltipped>
      </LinksContainer>
    </StyledHeader>
    <StyledMain>
      {children}
    </StyledMain>
  </LayoutWrapper>
)}

export default Layout
