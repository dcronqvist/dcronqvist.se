import React, { ReactNode } from 'react'
import Link from 'next/link'
import { useTheme } from './ThemeContext'

const LatestArticleView = (props) => {
    const { theme } = useTheme()

    return <table className={theme.latestArticleView.articles}>
        <tr>
            <td className={theme.latestArticleView.articledate}>19 Jul</td>
            <td className={theme.latestArticleView.articletitle}><a href={"/articles/how-to-use-fbprophet-for-easy-time-series-analysis"}>
            How to use FBProphet for easy Time Series Analysis</a>
            </td>
        </tr>
        <tr>
            <td className={theme.latestArticleView.articledate}>13 Jul</td>
            <td className={theme.latestArticleView.articletitle}><a href={"/articles/how-to-use-fbprophet-for-easy-time-series-analysis"}>
            My first internship! @ Ericsson</a>
            </td>
        </tr>
        <tr>
            <td className={theme.latestArticleView.articledate}>13 Jul</td>
            <td className={theme.latestArticleView.articletitle}><a href={"/articles/how-to-use-fbprophet-for-easy-time-series-analysis"}>
            My first internship! @ Ericsson</a>
            </td>
        </tr>
        <tr>
            <td className={theme.latestArticleView.articledate}>13 Jul</td>
            <td className={theme.latestArticleView.articletitle}><a href={"/articles/how-to-use-fbprophet-for-easy-time-series-analysis"}>
            My first internship! @ Ericsson</a>
            </td>
        </tr>
        <tr>
            <td className={theme.latestArticleView.articledate}>13 Jul</td>
            <td className={theme.latestArticleView.articletitle}><a href={"/articles/how-to-use-fbprophet-for-easy-time-series-analysis"}>
            My first internship! @ Ericsson</a>
            </td>
        </tr>
    </table>
}
  
export default LatestArticleView
  