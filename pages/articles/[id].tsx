import Layout from '@components/Layout'
import Link from 'next/link'
import { Theme, useTheme } from '@contexts/ThemeContext'
import { getAllArticles } from '../api/articles'
import { Article, getArticleLink } from '@model/articles'
import styled from 'styled-components'
import Highlight from 'react-highlight'
import React, { ReactNode } from 'react'
import Head from 'next/head'
import ArticleHeader from '@components/ArticleHeader'

import visit from 'unist-util-visit'
import { h } from 'hastscript'
import ReactMarkdown from 'react-markdown'
import directive from 'remark-directive'
import InteractiveAccountant from '@components/article-components/InteractiveAccountant'
import { GetStaticPaths, GetStaticProps } from 'next'

type Props = {
  article: Article
  tags: string[]
}

function htmlDirectives() {
  function transform(tree) {
    visit(
      tree,
      ['textDirective', 'leafDirective', 'containerDirective'],
      ondirective
    )
  }

  function ondirective(node) {
    const data = node.data || (node.data = {})
    const hast = h(node.name, node.attributes)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data.hName = hast.tagName

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data.hProperties = hast.properties
  }

  return transform
}

export const getStaticPaths: GetStaticPaths = async () => {
  const a = (await getAllArticles()).articles.map((article) => {
    return {
      params: {
        id: getArticleLink(article)
      }
    }
  })

  return {
    paths: [...a],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({
  params: { id }
}: {
  params: { id: string }
}) => {
  const articlesData = getAllArticles()
  const article = articlesData.articles.find(
    (article) => getArticleLink(article) === id
  )
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
  return href.startsWith('/') || href === '' || href.startsWith('#') ? (
    <Link href={href}>
      <a>{children}</a>
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

const ArticleContainer = styled.div<{ theme: Theme }>`
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

const MarkdownContent = styled.div<{ theme: Theme }>`
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
    line-height: 1.7rem;
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
    background-color: ${(props) => props.theme.backgroundAccent};
    border-radius: 5px;
  }

  & pre > code {
    font-size: 14px;
    overflow-wrap: normal;
    white-space: inherit;
  }

  & code {
    font-size: 18px;
    background-color: ${(props) => props.theme.backgroundAccent};
    border-radius: 5px;
    padding: 0 5px 0 5px;
    display: inline;
    white-space: normal;
    overflow-wrap: break-word;
  }

  & li {
    font-size: 20px;
    font-weight: 300;
    margin: 3px;
    line-height: 1.7rem;
  }
`

const ArticlePage = ({ article, tags }: Props): JSX.Element => {
  const { theme } = useTheme()

  const markdownComponents = {
    pre: function HighlightedCodeBlock({ children }: { children: ReactNode }) {
      return <Highlight>{children[0].props.children[0]}</Highlight>
    },
    a: CustomLink,
    h3: function MarkdownH3({ children }: { children: ReactNode }) {
      return (
        <>
          <a
            id={children[0]
              .toString()
              .toLowerCase()
              .replace(/[!',?]+/g, '')
              .replace(/[^a-z0-9]+/g, '-')}
          />
          <h3>{children[0]}</h3>
        </>
      )
    },
    h2: function MarkdownH2({ children }: { children: ReactNode }) {
      return (
        <>
          <a
            id={children[0]
              .toString()
              .toLowerCase()
              .replace(/[!',?]+/g, '')
              .replace(/[^a-z0-9]+/g, '-')}
          />
          <h2>{children[0]}</h2>
        </>
      )
    },
    h1: function MarkdownH1({ children }: { children: ReactNode }) {
      return (
        <>
          <a
            id={children[0]
              .toString()
              .toLowerCase()
              .replace(/[!',?]+/g, '')
              .replace(/[^a-z0-9]+/g, '-')}
          />
          <h1>{children[0]}</h1>
        </>
      )
    },
    h4: function MarkdownH4({ children }: { children: ReactNode }) {
      return (
        <>
          <a
            id={children[0]
              .toString()
              .toLowerCase()
              .replace(/[!',?]+/g, '')
              .replace(/[^a-z0-9]+/g, '-')}
          />
          <h4>{children[0]}</h4>
        </>
      )
    },
    interactiveaccountant: InteractiveAccountant
  }

  return (
    <Layout title={`dcronqvist | ${article.title}`} currentNav="">
      <Head>
        <link
          rel="stylesheet"
          href={`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/${theme.highlightjsCodeTheme}.min.css`}
        />
      </Head>
      <ArticleContainer theme={theme}>
        <ArticleHeader article={article} allTags={tags} />
        <article>
          <MarkdownContent theme={theme}>
            <ReactMarkdown
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              plugins={[directive, htmlDirectives]}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              components={markdownComponents}
            >
              {article.content}
            </ReactMarkdown>
          </MarkdownContent>
        </article>
      </ArticleContainer>
    </Layout>
  )
}

export default ArticlePage
