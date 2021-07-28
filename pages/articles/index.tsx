import Layout from '../../components/Layout'
import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import Link from 'next/link'
import { ArticleData, getAllArticles } from '../api/articles'
import { useTheme } from '../../contexts/ThemeContext';
import ArticlePreview from '../../components/ArticlePreview';


type ArticlePageProps = {
  articlesData: ArticleData
}

export async function getStaticProps(context) {
  return {
    props: { articlesData: JSON.parse(JSON.stringify(await getAllArticles())) }
  }
}

const ArticlesPage = ({ articlesData } : ArticlePageProps) => {
  const { theme } = useTheme()

  const tagToColor = (tag : string) => {
      const allColors = [
        '#00ffc2',
        '#ff9900',
        '#ff0000',
        '#42ff00',
        '#3e68ff',
        '#c892ff',
        '#99c2ff',
        '#ff99ef',
        '#99f9ff',
        '#99ffa3',
        '#99afff'
      ]

      return allColors[articlesData.allTags.indexOf(tag) % allColors.length]
  }

  const latestArticles = articlesData.articles.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  }).slice(0, 3).map(article => {
    return <ArticlePreview tagToColor={(tag) => tagToColor(tag)} article={article} key={article.slug} />
  })

  const searchResults = undefined

  return (<>
  <Layout title="Articles" currentNav="articles">
    <div className={theme.articlespage.container}>
      <div className={theme.articlespage.content}>
        <div className={theme.articlespage.section}>
          <h2>Search articles</h2>
          <input type="text" placeholder={"search for stuff"}></input>
        </div>
        <div className={theme.articlespage.section}>
          {searchResults ? <h2>Results</h2> : <h2>Latest articles</h2>}
          {latestArticles}
        </div>
      </div>
    </div>
  </Layout>
  </>
)}
  
export default ArticlesPage