import { createContext, ReactNode, useContext, useEffect, useState } from "react"

export type Theme = {
    allColors: string[],
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
    light: {
        allColors: [
            "#BDD4FF",
            "#BDEFFF",
            "#BDFFEF",
            "#BEFFBD",
            "#C6BDFF",
            "#EABDFF",
            "#EEFFBD",
            "#FFBDBD",
            "#FFBDDD",
            "#FFBDF8",
            "#FFDDBD",
            "#FFF1BD",
        ],
        primary: "#58677e",
        onPrimary: "#ffffff",
        secondary: "#006168",
        onSecondary: "#ffffff",
        background: "#f5f5f5",
        lighterBackground: "#d8d8d8",
        onBackground: "#000000",
        linkOnHover: "#39A0F3",
        onTags: "#000000",
        emoji: "☀️",
        highlightjsCodeTheme: "a11y-light"
    },
    dark: {
        allColors: [
            "#a1b3d3",
            "#9cc6d4",
            "#99cfc1",
            "#9acf9a",
            "#a098ce",
            "#ba95ca",
            "#bfcc96",
            "#ca9494",
            "#c790ab",
            "#c290bd",
            "#caaf96",
            "#cfc49a",
        ],
        primary: "#1E2228",
        onPrimary: "#e0e0e0",
        secondary: "#006168",
        onSecondary: "#ffffff",
        background: "#22272e",
        lighterBackground: "#4b5766",
        onBackground: "#e0e0e0",
        linkOnHover: "#39A0F3",
        onTags: "#000000",
        emoji: "🌑",
        highlightjsCodeTheme: "a11y-dark"
    }
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
