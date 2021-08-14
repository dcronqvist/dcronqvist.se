import Layout from '@components/Layout'
import Tooltipped from '@components/Tooltipped'
import GithubActivity from '@components/GithubActivity'
import LatestArticleView from '@components/LatestArticleView'
import { useTheme } from '@contexts/ThemeContext'
import { getAllArticles } from './api/articles'
import { Article } from '@model/articles'
import styled from 'styled-components'


type IndexPageProps = {
  articles: Article[]
}

export async function getStaticProps(context) {
  return {
    props: { articles: getAllArticles().articles }
  }
}

const HomeWrapper = styled.div`
  display: flex;
  justify-content: center;
  min-height: 82vh;
`

const HomeContainer = styled.div`
  padding-top: 20px;
  max-width: 800px;
  width: 90%;
  
  height: fit-content;

  & > img {
    width: 30%;
    float: right;
    /* height: fit-content; */
  }

  & > h3 {
    display: inline-block;
    width: 70%;
    margin-top: 0;
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 0;
    height: fit-content;
  }

  & > p {
    font-size: 24px;
  }
`

const IntroContainer = styled.div`
  width: 70%;

  & h3 {
    display: block;
    margin-top: 0;
    font-size: 48px;
    font-weight: 700;
  }

  & p {
    font-size: 24px;
  }
`

const Container = styled.div`
  width: 100%;
  display: inline-block;

  & > h3 {
    font-size: 24px;
    margin-bottom: 5px;
  }
`

const IndexPage = ({ articles }: IndexPageProps) => {
  const { theme } = useTheme()

  const latestArticles = articles.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  }).slice(0, 3)

  return (<>
  <Layout title="dcronqvist" currentNav="">
    <HomeWrapper>
      <HomeContainer>
        <h3>
          Hey there, I'm Daniel.
        </h3>
        <img src={"/imgofme-small.png"}/>
        <p>
          I'm a Computer Science and Engineering student at Chalmers University of Technology in Gothenburg, Sweden.
        </p>
        <Container>
          <h3>Latest articles</h3>
          <LatestArticleView articles={latestArticles}/>
        </Container>
        <Container>
          <h3>Latest activity on GitHub</h3>
          <GithubActivity username="dcronqvist"/>
        </Container>
      </HomeContainer>
    </HomeWrapper>
  </Layout>
  </>
)}

export default IndexPage
