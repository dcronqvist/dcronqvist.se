import Link from 'next/link'
import Layout from '../components/Layout'
import Image from 'next/image'
import profilePic from '../public/imgofme.png'
import commitsPic from '../public/commits.png'
import Tooltipped from '../components/Tooltipped'
import GithubActivity from '../components/GithubActivity'
import LatestArticleView from '../components/LatestArticleView'
import { useTheme } from '../contexts/ThemeContext'
import { getAllArticles, ArticleData } from './api/articles'

type IndexPageProps = {
  articlesData: ArticleData
}

export async function getStaticProps(context) {
  return {
    props: { articlesData: JSON.parse(JSON.stringify(await getAllArticles())) }
  }
}

const IndexPage = ({ articlesData }: IndexPageProps) => {
  const { theme } = useTheme()

  let profilePicHeight : number = 454
  let profilePicWidth : number = (422 / 454) * profilePicHeight

  const latestArticles = articlesData.articles.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  }).slice(0, 3)

  return (<>
  <Layout title="Home" currentNav="">
    <div className={theme.index.container}>
      <div className={`${theme.index.feedcontainer} ${theme.index.third}`}>
        <div className={theme.index.feed}>
          <h4>Latest activity on GitHub</h4>
          <GithubActivity username="dcronqvist"/>
        </div>
        <div className={theme.index.feed}>
          <h4>Latest articles</h4>
          <LatestArticleView articles={latestArticles}/>
        </div>        
      </div>
      <div className={`${theme.index.intro} ${theme.index.third}`}>
        <h3>
          Hey there, I'm Daniel.
        </h3>
        <p>
          I'm a Computer Science and Engineering student at Chalmers University of Technology in Gothenburg, Sweden.
        </p>
      </div>
      <div className={`${theme.index.profilepic} ${theme.index.third}`}>
        <Tooltipped text="Yep, that's me!">
          <img style={{width: "100%"}} src={"imgofme-small.png"}></img>
        </Tooltipped>
      </div>   
    </div>
  </Layout>
  </>
)}

export default IndexPage
