import { Theme, useTheme } from '../contexts/ThemeContext'
import styled from 'styled-components'
import Tooltipped from './Tooltipped'
import Icon from '@iconify/react'
import linkedinIcon from '@iconify/icons-mdi/linkedin'
import githubIcon from '@iconify/icons-mdi/github'
import mailIcon from '@iconify/icons-mdi/email'

const HorizontalCenterWrapper = styled.div<{ backColor: string }>`
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: ${(props) => props.backColor};
  transition: all 0.2s ease;
`

const StyledFooter = styled.footer<{ theme: Theme }>`
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
    text-decoration: underline;
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

const Footer = (): JSX.Element => {
  const { theme } = useTheme()

  return (
    <HorizontalCenterWrapper backColor={theme.primary}>
      <StyledFooter theme={theme}>
        <p>Made by Daniel Cronqvist</p>
        <a
          rel="noreferrer"
          href="https://github.com/dcronqvist/dcronqvist.se"
          target="_blank"
        >
          website source @ github
        </a>
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
        </LinksContainer>
      </StyledFooter>
    </HorizontalCenterWrapper>
  )
}

export default Footer
