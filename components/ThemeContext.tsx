import { createContext, ReactNode, useContext, useEffect, useState } from "react"

import lightCommitList from '../styles/themes/light/commitlist.module.css'
import lightIndex from '../styles/themes/light/index.module.css'
import lightLatestArticleView from '../styles/themes/light/latestarticleview.module.css'
import lightLayout from '../styles/themes/light/layout.module.css'
import lightNavlink from '../styles/themes/light/navlink.module.css'
import lightToolTipped from '../styles/themes/light/tooltipped.module.css'

import darkCommitList from '../styles/themes/dark/commitlist.module.css'
import darkIndex from '../styles/themes/dark/index.module.css'
import darkLatestArticleView from '../styles/themes/dark/latestarticleview.module.css'
import darkLayout from '../styles/themes/dark/layout.module.css'
import darkNavlink from '../styles/themes/dark/navlink.module.css'
import darkToolTipped from '../styles/themes/dark/tooltipped.module.css'

type Theme = {
    commitList,
    index,
    latestArticleView,
    layout,
    navlink,
    toolTipped,
}

const allThemes = {
    light: {
        commitList: lightCommitList,
        index: lightIndex,
        latestArticleView: lightLatestArticleView,
        layout: lightLayout,
        navlink: lightNavlink,
        toolTipped: lightToolTipped
    },
    dark: {
        commitList: darkCommitList,
        index: darkIndex,
        latestArticleView: darkLatestArticleView,
        layout: darkLayout,
        navlink: darkNavlink,
        toolTipped: darkToolTipped
    }
}

type ThemeContextType = {
    theme: Theme,
    setThemeName: any
}

const themeContextDefaultValues : ThemeContextType = {
    theme: allThemes.light,
    setThemeName: () => {}
}

const ThemeContext = createContext<ThemeContextType>(themeContextDefaultValues)

export function useTheme() {
    return useContext(ThemeContext)
}

type Props = {
    children: ReactNode
}

export const ThemeProvider = ({children}: Props) => {
    const [themeName, setThemeName] = useState<string>("light")
    const [theme, setTheme] = useState(allThemes.light)

    useEffect(() => {
        setTheme(allThemes[themeName])
    }, [themeName]);

    const value = {
        theme: theme,
        setThemeName: setThemeName
    }

    return <>
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    </>
}
