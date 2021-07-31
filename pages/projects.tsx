import Layout from '../components/Layout'
import { useTheme } from '../contexts/ThemeContext'

const IndexPage = () => {
  const { theme } = useTheme()

  return (<>
  <Layout title="Home" currentNav="projects">
    <div className={theme.projectsPage.container}>
      <h1>Projects</h1>

      <p>
        This page is still in development.
      </p>
    </div>
  </Layout>
  </>
  )}
  
  export default IndexPage