import React, { ReactNode } from 'react'
import Link from 'next/link'
import styles from '../styles/latestarticleview.module.css'


const LatestArticleView = (props) => {
    return <table className={styles.articles}>
        <tr>
            <td className={styles.articledate}>19th July</td>
            <td className={styles.articletitle}><a href={"/articles/how-to-use-fbprophet-for-easy-time-series-analysis"}>
            How to use FBProphet for easy Time Series Analysis</a>
            </td>
        </tr>
        <tr>
            <td className={styles.articledate}>13th July</td>
            <td className={styles.articletitle}><a href={"/articles/how-to-use-fbprophet-for-easy-time-series-analysis"}>
            My first internship! @ Ericsson</a>
            </td>
        </tr>
        <tr>
            <td className={styles.articledate}>13th July</td>
            <td className={styles.articletitle}><a href={"/articles/how-to-use-fbprophet-for-easy-time-series-analysis"}>
            My first internship! @ Ericsson</a>
            </td>
        </tr>
        <tr>
            <td className={styles.articledate}>13th July</td>
            <td className={styles.articletitle}><a href={"/articles/how-to-use-fbprophet-for-easy-time-series-analysis"}>
            My first internship! @ Ericsson</a>
            </td>
        </tr>
        <tr>
            <td className={styles.articledate}>13th July</td>
            <td className={styles.articletitle}><a href={"/articles/how-to-use-fbprophet-for-easy-time-series-analysis"}>
            My first internship! @ Ericsson</a>
            </td>
        </tr>
    </table>
}
  
export default LatestArticleView
  