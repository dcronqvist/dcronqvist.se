import Link from 'next/link'
import React from 'react'
import useSWR, { SWRConfig } from 'swr'
import { useTheme } from '../contexts/ThemeContext'
import { Article, getArticleLink } from 'types/articles'
import Tag from './Tag'
import styled from 'styled-components'

type Props = {
  article: Article,
  tags: string[],
}

const formatDate = (date : Date) => {
  return `${date.getFullYear()}-${date.getMonth() < 10 ? "0" : ""}${date.getMonth() + 1}-${date.getDate()}`
}

const ArticlePreviewLink = styled.a`
  user-select: none;
  text-decoration: none;
  color: #000000;

  &:hover {
    color: #000000 !important;
    cursor: pointer;
  }
`

const ArticlePreviewWrapper = styled.div`
  padding: 5px;

  &:hover {
    background-color: #e2e2e2;
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

const ArticlePreview = ({ article, tags } : Props) => {
  const { theme } = useTheme()
  
  return (
    <>
    <Link href={"/articles/" + getArticleLink(article)}>          
      <ArticlePreviewLink>
        <ArticlePreviewWrapper>
          <h3>{article.title}</h3>
            <div>
              <span>publ. {formatDate(new Date(article.date))}</span>
              <span>{article.tags.map(tag => <Tag key={tag} tag={tag} allTags={tags}/>)}</span>
          </div>
        </ArticlePreviewWrapper>
      </ArticlePreviewLink>
    </Link>
    </>
    )
  }
  
  export default ArticlePreview