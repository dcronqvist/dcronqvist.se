import React from 'react'
import Link from 'next/link'
import { useTheme, Theme } from '../contexts/ThemeContext'
import { Article, getArticleLink } from '@model/articles'
import styled from 'styled-components'

type Props = {
  articles: Article[]
}

const RowWrapper = styled.tr`
  font-size: 20px;

  @media only screen and (max-width: 800px) {
    font-size: 16px;

    .articlerow:nth-child(n + 4) {
      display: none;
    }
  }
`

const DateWrapper = styled.td<{ theme: Theme }>`
  vertical-align: top;
  font-weight: 400;
`
const TitleWrapper = styled.td<{ theme: Theme }>`
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
      0: 'Jan',
      1: 'Feb',
      2: 'Mar',
      3: 'Apr',
      4: 'May',
      5: 'Jun',
      6: 'Jul',
      7: 'Aug',
      8: 'Sep',
      9: 'Oct',
      10: 'Nov',
      11: 'Dec'
    }

    return `${d.getDate()}\u00A0${months[d.getMonth()]}`
  }

  return (
    <RowWrapper>
      <DateWrapper theme={theme}>{formatDate(article.date)}</DateWrapper>
      <TitleWrapper theme={theme}>
        <Link href={'articles/' + getArticleLink(article)}>
          <a>{article.title}</a>
        </Link>
      </TitleWrapper>
    </RowWrapper>
  )
}

const TableWrapper = styled.table`
  border-spacing: 0px 8px;
  width: 100%;
`

const LatestArticleView = ({ articles }: Props): JSX.Element => {
  return (
    <TableWrapper>
      {articles.map((article) => (
        <ArticlePreviewRow key={getArticleLink(article)} article={article} />
      ))}
    </TableWrapper>
  )
}

export default LatestArticleView
