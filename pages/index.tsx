import Link from 'next/link'
import Layout from '../components/Layout'
import Image from 'next/image'
import Wave from '../assets/wave.svg'
import styles from '../styles/index.module.css'

const IndexPage = () => {
  
  return (<>
  <Layout title="Home" currentNav="about me">
  </Layout>
  <div className={styles.wavecontainer}>
    <Wave className={`${styles.wave} ${styles.wave1} ${styles.slow}`}/>
    <Wave className={`${styles.wave} ${styles.wave2} ${styles.medium}`}/>
  </div>
  </>
)}

export default IndexPage
