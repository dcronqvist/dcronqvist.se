import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Theme, useTheme } from '../contexts/ThemeContext'
import NavLink from '../components/NavLink'
import { Icon } from '@iconify/react'
import linkedinIcon from '@iconify/icons-mdi/linkedin'
import githubIcon from '@iconify/icons-mdi/github'
import mailIcon from '@iconify/icons-mdi/email'
import Tooltipped from '../components/Tooltipped'
import styled from 'styled-components'
import Footer from './Footer'

type Props = {
  children?: ReactNode
  title?: string
  currentNav?: string
}

const LayoutWrapper = styled.div<{ theme: Theme }>`
  transition: all 0.2s ease;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.onBackground};

  & a:hover {
    color: ${(props) => props.theme.linkHover};
  }
`

const StyledHeader = styled.header<{ theme: Theme }>`
  background-color: ${(props) => props.theme.primary};
  max-width: 800px;
  width: 90%;
  color: ${(props) => props.theme.onPrimary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100000;
  height: 18vh;
  transition: all 0.2s ease;
  flex-direction: row;

  & a {
    color: inherit;
    text-decoration: none;
    min-width: fit-content;
  }

  & nav {
    min-width: 200px;
    color: inherit;
    height: fit-content;
    align-items: center;
    justify-content: flex-end;
    display: flex;
    flex-wrap: wrap;
    z-index: 100000;
    width: fit-content;
    white-space: nowrap;
  }

  & h1 {
    color: inherit;
    min-width: fit-content;
    font-weight: 600;
    font-size: 48px;
    z-index: 100000;
    text-decoration: none;
  }

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: wrap;

    & h1 {
      margin-top: 12px;
      font-size: 40px;
      margin-bottom: 12px;
    }
  }
`

const LinksContainer = styled.div<{ theme: Theme }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;

  & svg {
    padding: 0.5rem;
    height: 40px;
    width: 40px;
  }

  & a {
    color: ${(props) => props.theme.onPrimary};
  }

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    max-height: 18vh;
    height: 80%;
    width: max-content;
    flex-wrap: wrap;

    & svg {
      padding: 0;
      width: 25px;
      height: 25px;
    }
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

const HorizontalCenterWrapper = styled.div<{ backColor: string }>`
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: ${(props) => props.backColor};
  transition: all 0.2s ease;
`

const Layout = ({
  children,
  title = 'This is the default title',
  currentNav
}: Props): JSX.Element => {
  const { theme, setThemeName, currentThemeName, getThemeFromName } = useTheme()

  return (
    <LayoutWrapper theme={theme}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="favicon.ico" />
      </Head>
      <HorizontalCenterWrapper backColor={theme.primary}>
        <StyledHeader theme={theme}>
          <Link href="/">
            <a>
              <h1>dcronqvist.</h1>
            </a>
          </Link>
          <nav>
            <NavLink
              title="projects"
              href="/projects"
              at={currentNav == 'projects'}
            />
            <NavLink
              title="articles"
              href="/articles"
              at={currentNav == 'articles'}
            />
            <NavLink
              title="about me"
              href="/aboutme"
              at={currentNav == 'about me'}
            />
          </nav>
          <LinksContainer>
            <a
              rel="noreferrer"
              href="https://www.linkedin.com/in/dcronqvist/"
              target="_blank"
            >
              <Icon icon={linkedinIcon} />
            </a>
            <Tooltipped text="Follow me!">
              <a
                href="https://github.com/dcronqvist"
                rel="noreferrer"
                target="_blank"
              >
                <Icon icon={githubIcon} />
              </a>
            </Tooltipped>
            <Tooltipped text="Get in touch?">
              <a
                rel="noreferrer"
                href="mailto:daniel@dcronqvist.se"
                target="_blank"
              >
                <Icon icon={mailIcon} />
              </a>
            </Tooltipped>
            <Tooltipped text="Switch themes!">
              <ThemeSwitcher
                onClick={() => {
                  if (currentThemeName == 'light') {
                    setThemeName('dark')
                  } else {
                    setThemeName('light')
                  }
                }}
              >
                {currentThemeName == 'light'
                  ? getThemeFromName('dark').emoji
                  : getThemeFromName('light').emoji}
              </ThemeSwitcher>
            </Tooltipped>
          </LinksContainer>
        </StyledHeader>
      </HorizontalCenterWrapper>
      <StyledMain>{children}</StyledMain>
      <Footer />
    </LayoutWrapper>
  )
}

export default Layout
