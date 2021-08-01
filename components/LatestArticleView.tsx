import React, { ReactNode } from 'react'
import Link from 'next/link'
import { useTheme } from '../contexts/ThemeContext'
import { Article } from '../pages/api/articles'

type Props = {
    articles: Article[]
}

const ArticlePreviewRow = ({ article }: { article: Article }) => {
    const { theme } = useTheme()

    const formatDate = (date: string) => {
        const d = new Date(date)

        const months = {
            0: "Jan",
            1: "Feb",
            2: "Mar",
            3: "Apr",
            4: "May",
            5: "Jun",
            6: "Jul",
            7: "Aug",
            8: "Sep",
            9: "Oct",
            10: "Nov",
            11: "Dec"
        }

        return `${d.getDate()}\u00A0${months[d.getMonth()]}`
    }

    return (
        <tr className={theme.latestArticleView.articlerow}>
            <td className={theme.latestArticleView.articledate}>{formatDate(article.date)}</td>
            <td className={theme.latestArticleView.articletitle}><Link href={"articles/" + article.link}><a>
            {article.title}</a></Link></td>
        </tr>
    )
}

const LatestArticleView = ({ articles }: Props) => {
    const { theme } = useTheme()

    return <table className={theme.latestArticleView.articles}>
        {articles.map(article => <ArticlePreviewRow article={article} />)}
    </table>
}
  
export default LatestArticleView
  