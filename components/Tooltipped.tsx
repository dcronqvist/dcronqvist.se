import React from 'react'
import { useTheme } from './ThemeContext'
// React component which acts as a wrapper for another component which should have a certain tooltip.

type TooltippedProps = {
    text : string,
    children : any
}

const Tooltipped = ({text, children} : TooltippedProps) => {
    const { theme } = useTheme()

    return (
    <>
        <div className={theme.toolTipped.tooltip}>
            <span className={theme.toolTipped.tooltiptext}>{text}</span>
            {children}
        </div>
    </>
    )
}

export default Tooltipped