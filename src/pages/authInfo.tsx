import { Button, Drawer, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import axios from 'axios'
import Router from 'next/router'
import { useEffect, useState } from 'react'

import type { NextPage } from 'next'

import BottomAppBar from '@/components/AppBar/BottomAppBar'
import AuthInfoDetail from '@/components/AuthInfoDetail'
import AuthInfoNew from '@/components/AuthInfoNew'
import { useAuthContext } from '@/context/AuthContext'
import { fbAuth } from '@/lib/firebaseConfig'
import { AuthInfo } from '@/models'
import styles from '@/styles/AuthInfo.module.scss'

const AuthInfo: NextPage = () => {
  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.productionUrl : process.env.developmentUrl

  const [isNewOpen, setIsNewOpen] = useState<boolean>(false)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)
  const [authInfo, setAuthInfo] = useState<AuthInfo>({ service_name: '', login_id: '' })
  const [authInfos, setAuthInfos] = useState<AuthInfo[]>([])
  const { currentUser } = useAuthContext()

  const handleClickAuthInfo = (authInfo: AuthInfo) => () => {
    setAuthInfo(authInfo)
    setIsDetailOpen(true)
  }

  useEffect(() => {
    if (!currentUser) {
      Router.push('/')
    }
  }, [currentUser])

  useEffect(() => {
    fbAuth.currentUser?.getIdToken(true).then((idToken) => {
      const config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
      axios.get(`${apiUrl}/auth_infos`, config).then((response) => {
        setAuthInfos(response.data)
      })
    })
  }, [currentUser])

  const authInfoRows = authInfos.map((authInfo: AuthInfo, index, array) => {
    return (
      <TableRow key={authInfo.id}>
        <TableCell>{authInfo.service_name}</TableCell>
        <TableCell>{authInfo.login_id}</TableCell>
        <TableCell>{authInfo.password}</TableCell>
        <TableCell>{authInfo.other}</TableCell>
        <TableCell>
          <Button variant='text' size='small' onClick={handleClickAuthInfo(authInfo)}>
            編集
          </Button>
        </TableCell>
      </TableRow>
    )
  })

  return (
    <>
      <div className={styles.container}>
        <h2>機密情報</h2>
        <TableContainer component={Paper}>
          <Table className={styles.authenticateTable} size='small'>
            <TableHead>
              <TableRow>
                <TableCell>サービス名</TableCell>
                <TableCell>ログインID</TableCell>
                <TableCell>パスワード</TableCell>
                <TableCell>備考</TableCell>
                <TableCell>アクション</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{authInfoRows}</TableBody>
          </Table>
        </TableContainer>
      </div>
      <Drawer anchor='bottom' open={isNewOpen} onClose={() => setIsNewOpen(false)}>
        <AuthInfoNew setAuthInfos={setAuthInfos} onClose={() => setIsNewOpen(false)} />
      </Drawer>
      <Drawer className={styles.drawer} anchor='right' open={isDetailOpen} onClose={() => setIsDetailOpen(false)}>
        <AuthInfoDetail authInfo={authInfo} setAuthInfos={setAuthInfos} onClose={() => setIsDetailOpen(false)} />
      </Drawer>
      <BottomAppBar onAddItem={() => setIsNewOpen(true)} />
    </>
  )
}

export default AuthInfo
