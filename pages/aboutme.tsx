import Layout from '../components/Layout'
import styled from 'styled-components'

const StyledHeight = styled.div`
  min-height: 75vh;
`

const IndexPage = (): JSX.Element => {
  return (
    <>
      <Layout title="dcronqvist | About me" currentNav="about me">
        <StyledHeight>
          <p>This page is still in development.</p>
        </StyledHeight>
      </Layout>
    </>
  )
}

export default IndexPage
