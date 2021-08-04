import Link from 'next/link'
import React from 'react'
import useSWR, { SWRConfig } from 'swr'
import { useTheme } from '../contexts/ThemeContext'
import { Article, getArticleLink } from 'types/articles'
import Tag from './Tag'

type Props = {
  article: Article,
  tags: string[],
}

const formatDate = (date : Date) => {
  return `${date.getFullYear()}-${date.getMonth() < 10 ? "0" : ""}${date.getMonth() + 1}-${date.getDate()}`
}

const ArticlePreview = ({ article, tags } : Props) => {
  const { theme } = useTheme()
  
  return (
    <>
    <Link href={"/articles/" + getArticleLink(article)}>          
      <a className={theme.articlespage.articlepreviewlink}>
        <div className={theme.articlespage.articlepreview}>
          <h3>{article.title}</h3>
            <div>
              <span>publ. {formatDate(new Date(article.date))}</span>
              <span>{article.tags.map(tag => <Tag key={tag} tag={tag} allTags={tags}/>)}</span>
          </div>
        </div>
      </a>
    </Link>
    </>
    )
  }
  
  export default ArticlePreview