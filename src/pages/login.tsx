import { Button } from '@mui/material'
import Router from 'next/router'
import { useEffect } from 'react'

import styles from '../styles/Home.module.scss'

import type { NextPage } from 'next'

import BottomAppBar from '@/components/AppBar/BottomAppBar'
import { useAuthContext } from '@/context/AuthContext'
import { login } from '@/lib/firebaseAuth'

const Login: NextPage = () => {
  const { currentUser } = useAuthContext()

  const handleLogin = () => {
    login()
  }

  useEffect(() => {
    currentUser && Router.push('/')
  }, [currentUser])

  return (
    <>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1>ynym-portal</h1>
          <Button className={styles.button} variant='contained' onClick={handleLogin}>
            Login
          </Button>
        </main>
      </div>
      <BottomAppBar />
    </>
  )
}

export default Login
