import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import lightTheme from '@themes/light-theme'
import darkTheme from '@themes/dark-theme'

export type Theme = {
  tagColors: string[]
  tagTextColor: string
  primary: string
  onPrimary: string
  primaryLight: string
  primaryDark: string

  secondary: string
  onSecondary: string
  secondaryLight: string
  secondaryDark: string

  background: string
  backgroundAccent: string
  backgroundDarker: string
  onBackground: string
  onBackgroundAccent: string
  onBackgroundDarker: string

  linkHover: string

  emoji: string
  highlightjsCodeTheme: string
}

const allThemes: { [key: string]: Theme } = {
  light: lightTheme,
  dark: darkTheme
}

type ThemeContextType = {
  theme: Theme
  currentThemeName
  setThemeName: (themeName: string) => void
  allThemeNames: Array<string>
  getThemeFromName: (themeName: string) => Theme
}

const themeContextDefaultValues: ThemeContextType = {
  theme: allThemes.light,
  currentThemeName: 'dark',
  setThemeName: (themeName: string) => {}, // eslint-disable-line
  allThemeNames: Object.keys(allThemes),
  getThemeFromName: (themeName: string) => allThemes[themeName]
}

const ThemeContext = createContext<ThemeContextType>(themeContextDefaultValues)

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext)
}

type Props = {
  children: ReactNode
}

export const ThemeProvider = ({ children }: Props): JSX.Element => {
  const [themeName, setThemeName] = useState(
    themeContextDefaultValues.currentThemeName
  )
  const [theme, setTheme] = useState(themeContextDefaultValues.theme)

  useEffect(() => {
    const storedTheme = localStorage.getItem('config-theme')
    setThemeName(storedTheme || themeContextDefaultValues.currentThemeName)
  }, [])

  useEffect(() => {
    setTheme(allThemes[themeName])
    localStorage.setItem('config-theme', themeName)
  }, [themeName])

  const value = {
    theme: theme,
    currentThemeName: themeName,
    setThemeName: setThemeName,
    allThemeNames: Object.keys(allThemes),
    getThemeFromName: (themeName: string) => allThemes[themeName]
  }

  return (
    <>
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </>
  )
}
