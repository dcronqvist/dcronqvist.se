import Layout from '../components/Layout'
import { useTheme } from '../contexts/ThemeContext'

const IndexPage = () => {
  const { theme } = useTheme()

    return (<>
    <Layout title="dcronqvist | About me" currentNav="about me">
        <p>
          This page is still in development.
        </p>
    </Layout>
    </>
  )}
  
  export default IndexPage