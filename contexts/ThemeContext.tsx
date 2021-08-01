import { createContext, ReactNode, useContext, useEffect, useState } from "react"

import lightCommitList from '../styles/themes/light/commitlist.module.css'
import lightIndex from '../styles/themes/light/index.module.css'
import lightLatestArticleView from '../styles/themes/light/latestarticleview.module.css'
import lightLayout from '../styles/themes/light/layout.module.css'
import lightNavlink from '../styles/themes/light/navlink.module.css'
import lightToolTipped from '../styles/themes/light/tooltipped.module.css'
import lightArticlesPage from '../styles/themes/light/articlespage.module.css'
import lightProjectsPage from '../styles/themes/light/projects.module.css'

// import darkCommitList from '../styles/themes/dark/commitlist.module.css'
// import darkIndex from '../styles/themes/dark/index.module.css'
// import darkLatestArticleView from '../styles/themes/dark/latestarticleview.module.css'
// import darkLayout from '../styles/themes/dark/layout.module.css'
// import darkNavlink from '../styles/themes/dark/navlink.module.css'
// import darkToolTipped from '../styles/themes/dark/tooltipped.module.css'

type Theme = {
    commitList,
    index,
    latestArticleView,
    layout,
    navlink,
    toolTipped,
    articlespage,
    projectsPage,
    allColors: string[]
}

const allThemes : {[key: string]: Theme} = {
    light: {
        commitList: lightCommitList,
        index: lightIndex,
        latestArticleView: lightLatestArticleView,
        layout: lightLayout,
        navlink: lightNavlink,
        toolTipped: lightToolTipped,
        articlespage: lightArticlesPage,
        projectsPage: lightProjectsPage,
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
        ]
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
