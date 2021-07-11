import Link from 'next/link'
import Layout from '../components/Layout'
import Image from 'next/image'
import Wave from '../assets/wave2.svg'
import styles from '../styles/index.module.css'

const IndexPage = () => {
  
  return (
  <Layout title="Home" currentNav="about me">
    <div className={styles.wavecontainer}>
      <Wave className={styles.wave} fill={"#FFFFFF"}/>
    </div>
  </Layout>
)}

export default IndexPage
