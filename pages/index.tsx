import Link from 'next/link'
import Layout from '../components/Layout'
import Image from 'next/image'
import profilePic from '../public/imgofme.png'
import commitsPic from '../public/commits.png'
import Tooltipped from '../components/Tooltipped'
import GithubActivity from '../components/GithubActivity'
import LatestArticleView from '../components/LatestArticleView'
import { useTheme } from '../contexts/ThemeContext'
import { getAllArticles } from './api/articles'
import { Article } from 'types/articles'
import styled from 'styled-components'

type IndexPageProps = {
  articles: Article[]
}

export async function getStaticProps(context) {
  return {
    props: { articles: getAllArticles().articles }
  }
}

const HomeContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 82vh;
  padding-left: 5%;
  padding-right: 5%;
`

const Third = styled.div`
  padding: 2%;
  width: 25%;
`

const FeedContainer = styled(Third)`
  padding-left: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const IntroContainer = styled(Third)`
  & h3 {
    margin-top: 0;
    font-size: 3.4vw;
    font-weight: 700;
  }

  & p {
    font-size: 1.8vw;
  }
`

const Feed = styled.div`
  font-size: 20px;
  width: 100%;

  & h4 {
    font-size: 1.8vw;
    margin: 20px 0 20px 0;
  }
`

const ProfilePicContainer = styled(Third)`
  padding-right: 10%;
  display: flex;
  align-items: center;
  justify-content: center;

  & div {
    height: fit-content;
    width: fit-content;
  }
`

const IndexPage = ({ articles }: IndexPageProps) => {
  const { theme } = useTheme()

  let profilePicHeight : number = 454
  let profilePicWidth : number = (422 / 454) * profilePicHeight

  const latestArticles = articles.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  }).slice(0, 3)

  return (<>
  <Layout title="Home" currentNav="">
    <HomeContainer>
      <FeedContainer>
        <Feed>
          <h4>Latest activity on GitHub</h4>
          <GithubActivity username="dcronqvist"/>
        </Feed>
        <Feed>
          <h4>Latest articles</h4>
          <LatestArticleView articles={latestArticles}/>
        </Feed>        
      </FeedContainer>
      <IntroContainer>
        <h3>
          Hey there, I'm Daniel.
        </h3>
        <p>
          I'm a Computer Science and Engineering student at Chalmers University of Technology in Gothenburg, Sweden.
        </p>
      </IntroContainer>
      <ProfilePicContainer>
        <Tooltipped text="Yep, that's me!">
          <img style={{width: "100%"}} src={"imgofme-small.png"}></img>
        </Tooltipped>
      </ProfilePicContainer>   
    </HomeContainer>
  </Layout>
  </>
)}

export default IndexPage
