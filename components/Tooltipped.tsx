import React from 'react'
import styles from '../styles/tooltipped.module.css'
// React component which acts as a wrapper for another component which should have a certain tooltip.

type TooltippedProps = {
    text : string,
    children : any
}

const Tooltipped = ({text, children} : TooltippedProps) => {
    return (
    <>
        <div className={styles.tooltip}>
            <span className={styles.tooltiptext}>{text}</span>
            {children}
        </div>
    </>
    )
}

export default Tooltipped