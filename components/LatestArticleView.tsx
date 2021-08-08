import React, { ReactNode } from 'react'
import Link from 'next/link'
import { useTheme, Theme } from '../contexts/ThemeContext'
import { Article, getArticleLink } from 'types/articles'
import styled from 'styled-components'

type Props = {
    articles: Article[]
}

const RowWrapper = styled.tr`
    @media only screen and (max-width: 750px) {
        .articlerow:nth-child(n + 4) {
            display: none;
        }
    }
`

const DateWrapper = styled.td<{theme: Theme}>`
    vertical-align: top;
    font-size: 1.1vw;
    font-weight: 400;
`
const TitleWrapper = styled.td<{theme: Theme}>`
    font-size: 1.1vw;
    font-weight: 300;

    & a {
        color: inherit;
    }
`

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
        <RowWrapper>
            <DateWrapper theme={theme}>{formatDate(article.date)}</DateWrapper>
            <TitleWrapper theme={theme}><Link href={"articles/" + getArticleLink(article)}><a>
            {article.title}</a></Link></TitleWrapper>
        </RowWrapper>
    )
}

const TableWrapper = styled.table`
    border-spacing: 2px 8px;
`

const LatestArticleView = ({ articles }: Props) => {
    const { theme } = useTheme()

    return <TableWrapper>
        {articles.map(article => <ArticlePreviewRow article={article} />)}
    </TableWrapper>
}
  
export default LatestArticleView
  