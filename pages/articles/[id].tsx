import Layout from '@components/Layout'
import Link from 'next/link'
import { Theme, useTheme } from '@contexts/ThemeContext';
import { getAllArticles } from "../api/articles";
import { Article, getArticleLink } from 'types/articles'
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
    
const Section = styled.div`

`
    
const Content = styled.div<{theme: Theme}>`
  padding-top: 20px;
  min-height: calc(82vh - 20px);
  position: relative;
  max-width: 750px;
  width: 95%;

  & ${Section} {
    padding: 12px;
  }

  & ${Section} input[type="text"] {
    width: 60%;
    background-color: #e2e2e2;
    border: 0.5px solid #b1b1b1;
    border-radius: 10px;
    padding: 10px;
  }

  & ${Section} input[type="text"]:focus {
    width: 60%;
    border: 0.5px solid #b1b1b1;
    border-radius: 10px;
    padding: 10px;
  }

  & ${Section} h2 {
    font-size: 32px;
    margin: 0;
    padding: 0;
    margin-bottom: 8px;
  }

  & header {
    width: 100%;
  } 

  & header a {
    color: ${props => props.theme.onBackground};
    text-decoration: underline;
  }

  & header h1 {
    font-size: 42px;
    width: 100%;
    margin: 0;
    padding: 0;
    margin-bottom: 10px;
  }

  & header h2 {
    display: inline;
    font-size: 20px;
    font-weight: 300;
    margin: 0;
    padding: 0;
    margin-right: 10px;
  }

  & article {
    line-height: 1.8rem;
    font-size: 20px;
    width: 100%;
  }

  & header div {
    display: flex;
    align-items: center;
  }
`
    
const ArticleContainer = styled.div<{theme: Theme}>`
  display: flex;
  justify-content: center;
`

const StyledIcon = styled(Icon)`
  display: flex;
  margin-right: 10px;
`

const MarkdownContent = styled.div<{theme: Theme}>`
  height: max(100vh, 100%);
  display: inline;

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
        console.log(children[0].props.children[0])

        return <Highlight>
          {children[0].props.children[0]}
        </Highlight>
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
        <Content theme={theme}>
        <header>
          <h1>{article.title}</h1>
            <div>
            {publishedText}
            <a target="_blank" href={`mailto:${article.author.email}`}>
              <StyledIcon width={25} icon={mailIcon}/>
            </a>
            <span>{article.tags.map(tag => <Tag key={tag} tag={tag} allTags={tags}/>)}</span>
            </div>
          {article.referencedProjects ? 
          <div>
          <h2>references {article.referencedProjects?.length > 1 ? "projects" : "project"}{' '}{article.referencedProjects.map(project => <><a key={project.link} target="_blank" href={project.link}>{project.name}</a>{' '}</>)}</h2>
          </div>
          : ""}
        </header>
          <article>
          {article.image ? 
            <ArticleImg>
              <img src={"/" + article.image}/>
            </ArticleImg>
            : ""}
            <MarkdownContent theme={theme}>
              {content}
            </MarkdownContent>
            </article>
        </Content>
    </ArticleContainer>
  </Layout>
  )
}
      
export default ArticlePage