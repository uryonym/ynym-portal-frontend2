import BottomAppBar from '@/components/BottomAppBar'
import { useAuthContext } from '@/context/AuthContext'
import type { NextPage } from 'next'
import Head from 'next/head'
import Router from 'next/router'
import { useEffect } from 'react'
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
  const { currentUser } = useAuthContext()

  useEffect(() => {
    currentUser || Router.push('login')
  }, [currentUser])

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>ynym-portal</title>
        </Head>

        <main className={styles.main}>
          <h1>ynym-portal</h1>
        </main>
      </div>
      <BottomAppBar />
    </>
  )
}

export default Home
