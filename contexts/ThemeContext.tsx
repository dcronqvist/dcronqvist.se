import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import lightTheme from '@themes/light-theme'
import darkTheme from '@themes/dark-theme'

export type Theme = {
    tagColors: string[],
    primary: string,
    onPrimary: string,
    secondary: string,
    onSecondary: string,
    background: string,
    lighterBackground: string,
    onBackground: string,
    linkOnHover: string,
    onTags: string,
    emoji: string,
    highlightjsCodeTheme: string
}

const allThemes : {[key: string]: Theme} = {
    light: lightTheme,
    dark: darkTheme
}

type ThemeContextType = {
    theme: Theme,
    currentThemeName,
    setThemeName: any,
    allThemeNames: Array<string>,
    getThemeFromName: (themeName: string) => Theme
}

const themeContextDefaultValues : ThemeContextType = {
    theme: allThemes.light,
    currentThemeName: 'light',
    setThemeName: () => {},
    allThemeNames: Object.keys(allThemes),
    getThemeFromName: (themeName: string) => allThemes[themeName]
}

const ThemeContext = createContext<ThemeContextType>(themeContextDefaultValues)

export function useTheme() {
    return useContext(ThemeContext)
}

type Props = {
    children: ReactNode
}

export const ThemeProvider = ({children}: Props) => {
    const [themeName, setThemeName] = useState(themeContextDefaultValues.currentThemeName)
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

    return <>
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    </>
}
