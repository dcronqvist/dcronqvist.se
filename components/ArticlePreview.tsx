import Link from 'next/link'
import React from 'react'
import { Theme, useTheme } from '../contexts/ThemeContext'
import { Article, getArticleLink } from '@model/articles'
import Tag from './Tag'
import styled from 'styled-components'

type Props = {
  article: Article
  tags: string[]
}

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() < 10 ? '0' : ''}${
    date.getMonth() + 1
  }-${date.getDate() < 10 ? '0' : ''}${date.getDate()}`
}

const ArticlePreviewLink = styled.a<{ theme: Theme }>`
  user-select: none;
  text-decoration: none;
  color: inherit;

  &:hover {
    color: ${(props) => props.theme.onBackground} !important;
    cursor: pointer;
  }
`

const ArticlePreviewWrapper = styled.div`
  padding: 5px;

  &:hover {
    background-color: ${(props) => props.theme.backgroundAccent};
  }

  & div {
    display: flex;
    align-items: center;
  }

  & h3 {
    font-size: 22px;
    font-weight: 500;
    margin: 0;
    padding: 0;
  }

  & span {
    margin-right: 5px;
    font-size: 16px;
    font-weight: 200;
  }
`

const ArticlePreview = ({ article, tags }: Props): JSX.Element => {
  const { theme } = useTheme()
  // Testing comment
  return (
    <>
      <Link passHref={true} href={'/articles/' + getArticleLink(article)}>
        <ArticlePreviewLink theme={theme}>
          <ArticlePreviewWrapper theme={theme}>
            <h3>{article.title}</h3>
            <div>
              <span>publ. {formatDate(new Date(article.date))}</span>
              <span>
                {article.tags.map((tag) => (
                  <Tag key={tag} tag={tag} allTags={tags} />
                ))}
              </span>
            </div>
          </ArticlePreviewWrapper>
        </ArticlePreviewLink>
      </Link>
    </>
  )
}

export default ArticlePreview
