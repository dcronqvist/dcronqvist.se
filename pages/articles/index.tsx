import Layout from '@components/Layout'
import ArticlePreview from '@components/ArticlePreview'
import { useState } from 'react'
import Tag from '@components/Tag'
import { Article } from '@model/articles'
import { getAllArticles } from 'pages/api/articles'
import styled from 'styled-components'
import { GetStaticProps } from 'next'

type ArticlePageProps = {
  articles: Article[]
  tags: string[]
}

// eslint-disable-next-line
export const getStaticProps = async (context): GetStaticProps => {
  const { articles, tags } = getAllArticles()

  return {
    props: {
      articles,
      tags
    }
  }
}

const interleave = (arr, arr2) =>
  arr.reduce((combArr, elem, i) => combArr.concat(elem, arr2[i]), [])

const Container = styled.div`
  display: flex;
  justify-content: center;
`

const Section = styled.div`
  & input[type='text'] {
    width: 60%;
    background-color: #e2e2e2;
    border: 0.5px solid #b1b1b1;
    border-radius: 10px;
    padding: 10px;
  }

  & input[type='text']:focus {
    width: 60%;
    border: 0.5px solid #b1b1b1;
    border-radius: 10px;
    padding: 10px;
  }

  & h2 {
    font-size: 32px;
    margin: 0;
    padding: 0;
    margin-bottom: 8px;
  }
`

const Content = styled.div`
  padding-top: 20px;
  min-height: calc(82vh - 20px);
  position: relative;
  max-width: 800px;
  width: 95%;

  & ${Section} {
    padding: 12px 0px;
  }
`

const TagsContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`

const ArticlesPage = ({ articles, tags }: ArticlePageProps): ReactNode => {
  const [search, setSearch] = useState<string>('')
  const [selectedTag, setSelectedTag] = useState<string>('')

  const latestArticles = articles
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, 3)
    .map((article) => {
      return (
        <ArticlePreview tags={tags} article={article} key={article.title} />
      )
    })

  const searchResults =
    search != '' || selectedTag != ''
      ? articles
          .filter((article) => {
            const searchString = search.toLowerCase()
            const title = article.title.toLowerCase()
            const tags = article.tags.map((tag) => tag.toLowerCase())
            if (searchString != '' && title.includes(searchString)) {
              return true
            }
            if (tags.includes(selectedTag)) {
              return true
            }
            return false
          })
          .map((article) => {
            return (
              <ArticlePreview
                tags={tags}
                article={article}
                key={article.title}
              />
            )
          })
      : undefined

  const lines = (amount) => {
    const lines = []

    for (let i = 0; i < amount; i++) {
      lines.push(
        <svg
          key={i}
          stroke={'rgb(168, 168, 168)'}
          viewBox="0 0 726 1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="0" y1="0.5" x2="726" y2="0.5" />
        </svg>
      )
    }

    return lines
  }

  const displayedArticles = interleave(
    searchResults || latestArticles,
    lines((searchResults || latestArticles).length - 1)
  )

  return (
    <>
      <Layout title="dcronqvist | Articles" currentNav="articles">
        <Container>
          <Content>
            <Section>
              <h2>Search articles</h2>
              <input
                type="text"
                placeholder={'search for stuff'}
                onChange={(e) => setSearch(e.target.value)}
              ></input>
              <TagsContainer>
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    onClick={() => {
                      if (selectedTag === tag) {
                        setSelectedTag('')
                      } else {
                        setSelectedTag(tag)
                      }
                    }}
                    fade={selectedTag !== '' && selectedTag !== tag}
                    allTags={tags}
                    tag={tag}
                  />
                ))}
              </TagsContainer>
            </Section>
            <Section>
              {searchResults ? <h2>Results</h2> : <h2>Latest articles</h2>}
              {displayedArticles}
            </Section>
          </Content>
        </Container>
      </Layout>
    </>
  )
}

export default ArticlesPage
