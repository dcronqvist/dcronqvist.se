import styled, { createGlobalStyle } from 'styled-components'
import { Theme, useTheme } from '@contexts/ThemeContext'
import linkedinIcon from '@iconify/icons-mdi/linkedin'
import githubIcon from '@iconify/icons-mdi/github'
import mailIcon from '@iconify/icons-mdi/email'
import Icon from '@iconify/react'
import Tooltipped from '@components/Tooltipped'

const Wrapper = styled.div<{ theme: Theme }>`
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  color: ${({ theme }) => theme.onBackground};
`

const Box = styled.div<{ theme: Theme }>`
  display: grid;

  padding: 1rem;

  max-width: 450px;
  grid-column-gap: 20px;
`

const Header = styled.h1`
  font-size: 2rem;
  font-weight: 700;

  grid-column-start: 1;
  grid-column-end: 4;

  grid-row-start: 1;
  grid-row-end: 2;
`

const Content = styled.div`
  grid-column-start: 1;
  grid-column-end: 7;

  grid-row-start: 2;
  grid-row-end: 4;

  font-size: 1.2rem;
`

const Links = styled.div<{ theme: Theme }>`
  grid-column-start: 4;
  grid-column-end: 7;

  grid-row-start: 1;
  grid-row-end: 2;

  display: flex;
  justify-content: center;
  align-items: center;

  & a {
    color: ${({ theme }) => theme.onBackground};
  }

  & a:hover {
    color: ${({ theme }) => theme.linkHover};
  }

  & svg {
    padding: 0.1rem;
    height: 35px;
    width: 35px;
  }
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

const Global = createGlobalStyle<{ theme: Theme }>`
  body {
    margin: 0px;
    font-family: 'Roboto';

    background-color: ${({ theme }) => theme.background};

    transition: all 0.2s ease;
  }
`

const Link = styled.a`
  color: ${({ theme }: { theme: Theme }) => theme.secondary};
`

const IndexPage = (): JSX.Element => {
  const { theme, setThemeName, currentThemeName, getThemeFromName } = useTheme()

  return (
    <>
      <Global theme={theme} />
      <Wrapper theme={theme}>
        <Box theme={theme}>
          <Header>dcronqvist.</Header>
          <Links theme={theme}>
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
          </Links>
          <Content>
            i&apos;m daniel, a software developer from sweden. computer graphics,
            programming languages, computer engineering, and game development
            are some of my main interests. 
            <br/><br/>
            i'm a system developer at <Link theme={theme} href="https://www.raysearchlabs.com/" target="_blank">raysearch laboratories</Link> in stockholm.
          </Content>
        </Box>
      </Wrapper>
    </>
  )
}

export default IndexPage
