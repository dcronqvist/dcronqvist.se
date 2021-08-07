import { createContext, ReactNode, useContext, useEffect, useState } from "react"

export type Theme = {
    allColors: string[],
    primary: string,
    onPrimary: string,
    secondary: string,
    onSecondary: string,
    background: string,
    onBackground: string,
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
        primary: "#1A2719",
        onPrimary: "#ffffff",
        secondary: "#006168",
        onSecondary: "#ffffff",
        background: "#ffffff",
        onBackground: "#000000",
    },
    // dark: {
    //     commitList: darkCommitList,
    //     index: darkIndex,
    //     latestArticleView: darkLatestArticleView,
    //     layout: darkLayout,
    //     navlink: darkNavlink,
    //     toolTipped: darkToolTipped
    // }
}

type ThemeContextType = {
    theme: Theme,
    currentThemeName,
    setThemeName: any,
    allThemeNames: Array<string>
}

const themeContextDefaultValues : ThemeContextType = {
    theme: allThemes.light,
    currentThemeName: 'light',
    setThemeName: () => {},
    allThemeNames: Object.keys(allThemes)
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
        allThemeNames: Object.keys(allThemes)
    }

    return <>
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    </>
}
