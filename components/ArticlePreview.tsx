import Link from 'next/link'
import React from 'react'
import useSWR, { SWRConfig } from 'swr'
import { useTheme } from '../contexts/ThemeContext'

type Props = {
    article,
    tagToColor: (tag : string) => string
}

const formatDate = (date : Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

const ArticlePreview = ({ article, tagToColor } : Props) => {
    const { theme } = useTheme()

    return (
        <Link href={"articles/" + article.link}>          
            <a className={theme.articlespage.articlepreviewlink}>
                <div className={theme.articlespage.articlepreview}>
                    <h3>{article.title}</h3>
                    <div>
                        <span>publ. {formatDate(new Date(article.date))}</span>
                        <span>{article.tags.map(tag => <span style={{backgroundColor: tagToColor(tag)}} className={theme.articlespage.tagblob}>{tag}</span>)}</span>
                    </div>
                </div>
            </a>
        </Link>
    )
}

export default ArticlePreview