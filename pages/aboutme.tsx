import Layout from '../components/Layout'
import { useTheme } from '../contexts/ThemeContext'

const IndexPage = () => {
  const { theme } = useTheme()

    return (<>
    <Layout title="About me" currentNav="who's daniel?">
        <p>
          This page is still in development.
        </p>
    </Layout>
    </>
  )}
  
  export default IndexPage