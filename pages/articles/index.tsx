import Layout from '@components/Layout'
import { useTheme } from '@contexts/ThemeContext';
import ArticlePreview from '@components/ArticlePreview';
import { useState } from 'react';
import Tag from '@components/Tag'
import { Article } from 'types/articles';
import { getAllArticles } from 'pages/api/articles';

type ArticlePageProps = {
  articles: Article[],
  tags: string[],
}

export async function getStaticProps(context) {
  const { articles, tags } = getAllArticles()

  return {
    props: {
      articles,
      tags,
    }
  }
}

const interleave = (arr, arr2) => arr
  .reduce((combArr, elem, i) => combArr.concat(elem, arr2[i]), []); 

const ArticlesPage = ({ articles, tags } : ArticlePageProps) => {
  const { theme } = useTheme()
  const [ search, setSearch ] = useState<string>("")
  const [ selectedTag, setSelectedTag ] = useState<string>("")

  const latestArticles = articles.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  }).slice(0, 3).map(article => {
    return <ArticlePreview tags={tags} article={article} key={article.title} />
  })

  const searchResults = search != "" || selectedTag != "" ? articles.filter(article => {
    const searchString = search.toLowerCase()
    const title = article.title.toLowerCase()
    const tags = article.tags.map(tag => tag.toLowerCase())
    if (searchString != "" && title.includes(searchString)) {
      return true
    }
    if (tags.includes(selectedTag)) {
      return true
    }
    return false
  }).map(article => {
    return <ArticlePreview tags={tags} article={article} key={article.title} />
  }) : undefined

  const lines = (amount) => {
    const lines = []

    for (let i = 0; i < amount; i++) {
      lines.push(<svg key={i} className={theme.projectsPage.grayish} viewBox="0 0 726 1" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="0.5" x2="726" y2="0.5"/>
     </svg>)
    }

    return lines
  }

  const displayedArticles = interleave((searchResults || latestArticles), lines((searchResults || latestArticles).length - 1))

  return (<>
  <Layout title="Articles" currentNav="articles">
    <div className={theme.articlespage.container}>
      <div className={theme.articlespage.content}>
        <div className={theme.articlespage.section}>
          <h2>Search articles</h2>
          <input type="text" placeholder={"search for stuff"} onChange={(e) => setSearch(e.target.value)}></input>
          <div className={theme.articlespage.tagscontainer}>
            {tags.map(tag => <Tag key={tag} onClick={() => {
                if(selectedTag === tag) {
                  setSelectedTag("")
                } else {
                  setSelectedTag(tag)
                }
              }
            } fade={selectedTag !== "" && selectedTag !== tag} allTags={tags} tag={tag}/>)}
          </div>
        </div>
        <div className={theme.articlespage.section}>
          {searchResults ? <h2>Results</h2> : <h2>Latest articles</h2>}
          {displayedArticles}
        </div>
      </div>
    </div>
  </Layout>
  </>
)}
  
export default ArticlesPage