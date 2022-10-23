import Head from 'next/head'
import Router from 'next/router'
import { useEffect } from 'react'

import styles from '../styles/Home.module.scss'

import type { NextPage } from 'next'

import BottomAppBar from '@/components/AppBar/BottomAppBar'
import { useAuthContext } from '@/context/AuthContext'

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
