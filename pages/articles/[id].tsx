import Layout from '@components/Layout'
import Link from 'next/link'
import { Theme, useTheme } from '@contexts/ThemeContext';
import { getAllArticles } from "../api/articles";
import { Article, getArticleLink } from '@model/articles'
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import mailIcon from '@iconify/icons-mdi/email'
import { Icon } from '@iconify/react';
import Tag from '@components/Tag';
import styled from 'styled-components';
import Highlight from 'react-highlight';
import React, { ReactNode } from 'react';
import Head from 'next/head';
import ArticleHeader from '@components/ArticleHeader';

type Props = {
  article: Article,
  tags: string[]
}

export async function getStaticPaths() {
  const a = (await getAllArticles()).articles.map(article => {
    return {
      params: {
        id: getArticleLink(article)
      }
    }
  })
  
  return {
    paths: [
      ...a
    ],
    fallback: false
  }
}

const formatDate = (date : Date) => {
  return `${date.getFullYear()}-${date.getMonth() < 9 ? "0" : ""}${date.getMonth() + 1}-${date.getDate() < 9 ? "0" : ""}${date.getDate()}`
}

export async function getStaticProps({ params }) {
  const articlesData = getAllArticles()
  const article = articlesData.articles.find(article => getArticleLink(article) === params.id)
  const allTags = articlesData.tags
  
  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
      tags: allTags
    }
  }
}

function CustomLink({ children, href }) {
  // If the link is local it will start with a "/"
  // Otherwise it'll be something like "https://"
  return href.startsWith('/') || href === '' || href.startsWith("#") ? (
    <Link href={href}>
      <a>
      {children}
      </a>
    </Link>
    ) : (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        >
    {children}
    </a>
  );
}
    
const ArticleContainer = styled.div<{theme: Theme}>`
  display: flex;
  flex-direction: column;
  min-height: 82vh;

  & > article {
    display: flex;
    justify-content: center;
  }

  & > article > div {
    max-width: 800px;
    width: 90%;
  }
`

const MarkdownContent = styled.div<{theme: Theme}>`
  height: max(100vh, 100%);
  display: inline;
  font-size: 20px;

  & a {
      font-weight: 400;
      color: inherit;
      text-decoration: underline;
  }

  & p {
    font-weight: 300;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  & h3 {
    margin-block-start: 1rem;
    margin-block-end: 1rem;
  }

  & h4 {
    margin-block-start: 1rem;
    margin-block-end: 1rem;
  }

  & pre {
    font-size: 14px;
    line-height: 1.1rem;
    background-color: ${props => props.theme.lighterBackground};
    border-radius: 5px;
  }

  & pre code {
    font-size: 14px;
  }

  & code {
    font-size: 18px;
    background-color: ${props => props.theme.lighterBackground};
    border-radius: 5px;
    padding: 0 5px 0 5px;
  }

  & li {
    font-size: 20px;
    font-weight: 300;
  }
`

const ArticleImg = styled.div`
  padding: 20px;
  width: 40%;
  float: right;
  display: inline;

  & img {
      width: 100%;
  }
`


const ArticlePage = ({ article, tags } : Props) => {
  const { theme } = useTheme()

  const content = unified()
  .use(parse)
  .use(remark2react, {
    remarkReactComponents: {
      // Use CustomLink instead of <a>
      a: CustomLink,
      pre: ({children}: {children: ReactNode}) => {
        return <Highlight>
          {children[0].props.children[0]}
        </Highlight>
      },
      h3: ({children}: {children: ReactNode}) => {
        return <>
          <a id={children[0].toString().toLowerCase().replace(/[!',?]+/g, "").replace(/[^a-z0-9]+/g, '-')}/>
          <h3>{children[0]}</h3>
        </>
      },
      h2: ({children}: {children: ReactNode}) => {
        return <>
          <a id={children[0].toString().toLowerCase().replace(/[!',?]+/g, "").replace(/[^a-z0-9]+/g, '-')}/>
          <h2>{children[0]}</h2>
        </>
      },
      h1: ({children}: {children: ReactNode}) => {
        return <>
          <a id={children[0].toString().toLowerCase().replace(/[!',?]+/g, "").replace(/[^a-z0-9]+/g, '-')}/>
          <h1>{children[0]}</h1>
        </>
      },
      h4: ({children}: {children: ReactNode}) => {
        return <>
          <a id={children[0].toString().toLowerCase().replace(/[!',?]+/g, "").replace(/[^a-z0-9]+/g, '-')}/>
          <h4>{children[0]}</h4>
        </>
      }
    },
  })
  .processSync(article.content).result;
  
  const publishedText = <h2>
    published on {formatDate(new Date(article.date))} by{' '}
    <a href={article.author.link} target="_blank">
      {article.author.name}
    </a>
  </h2>

  return (
    <Layout title={article.title} currentNav="">
      <Head>
        <link rel="stylesheet" href={`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/${theme.highlightjsCodeTheme}.min.css`}/>
      </Head>
      <ArticleContainer theme={theme}>
        <ArticleHeader article={article} allTags={tags}/>
        <article>
          <MarkdownContent theme={theme}>
            {content}
          </MarkdownContent>
        </article>
    </ArticleContainer>
  </Layout>
  )
}
      
export default ArticlePage