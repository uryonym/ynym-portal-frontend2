import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { AppBar, Button, IconButton, TextField, Toolbar } from '@mui/material'
import { Stack } from '@mui/system'
import axios from 'axios'
import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import DeleteConfirmDialog from './DeleteComfirmDialog'

import { fbAuth } from '@/lib/firebaseConfig'
import { AuthInfo } from '@/models'
import styles from '@/styles/TaskDetail.module.scss'

type AuthInfoDetailProps = {
  authInfo: AuthInfo
  setAuthInfos: Dispatch<SetStateAction<AuthInfo[]>>
  onClose: () => void
}

const AuthInfoDetail: FC<AuthInfoDetailProps> = ({ authInfo, setAuthInfos, onClose }) => {
  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.productionUrl : process.env.developmentUrl

  const [serviceName, setServiceName] = useState<string>('')
  const [loginId, setLoginId] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [other, setOther] = useState<string>('')

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleChangeServiceName = (e: ChangeEvent<HTMLInputElement>) => {
    setServiceName(e.target.value)
  }

  const handleChangeLoginId = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginId(e.target.value)
  }

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleChangeOther = (e: ChangeEvent<HTMLInputElement>) => {
    setOther(e.target.value)
  }

  const handleSave = () => {
    fbAuth.currentUser?.getIdToken(true).then((idToken) => {
      const data = {
        auth_info: {
          service_name: serviceName,
          login_id: loginId,
          password: password || null,
          other: other || null,
        },
      }
      const config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
      axios
        .patch(`${apiUrl}/auth_infos/${authInfo.id}`, data, config)
        .then((response) => {
          setAuthInfos((prevState) => prevState.map((x) => (x.id === authInfo.id ? response.data : x)))
          onClose()
        })
        .catch((error) => console.log(error))
    })
  }

  const handleClickDelete = () => {
    setIsOpen(true)
  }

  const handleDelete = () => {
    setIsOpen(false)

    fbAuth.currentUser?.getIdToken(true).then((idToken) => {
      const config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
      axios
        .delete(`${apiUrl}/auth_infos/${authInfo.id}`, config)
        .then(() => {
          setAuthInfos((prevState) => prevState.filter((x) => x.id !== authInfo.id))
          onClose()
        })
        .catch((error) => console.log(error))
    })
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    setServiceName(authInfo.service_name)
    setLoginId(authInfo.login_id)
    setPassword(authInfo.password || '')
    setOther(authInfo.other || '')
  }, [authInfo])

  return (
    <>
      <div className={styles.container}>
        <TextField
          className={styles.formControl}
          fullWidth
          placeholder='サービス名を入力'
          variant='standard'
          value={serviceName}
          onChange={handleChangeServiceName}
        />
        <TextField
          className={styles.formControl}
          fullWidth
          placeholder='ログインIDを入力'
          variant='standard'
          value={loginId}
          onChange={handleChangeLoginId}
        />
        <TextField
          className={styles.formControl}
          fullWidth
          placeholder='パスワードを入力'
          variant='standard'
          value={password}
          onChange={handleChangePassword}
        />
        <TextField
          className={styles.formControl}
          fullWidth
          placeholder='備考を入力'
          variant='standard'
          value={other}
          onChange={handleChangeOther}
        />
        <Stack direction='row' justifyContent='space-between'>
          <Button variant='outlined' color='error' onClick={handleClickDelete}>
            削除
          </Button>
          <Button variant='outlined' onClick={handleSave}>
            保存
          </Button>
          <DeleteConfirmDialog open={isOpen} onExec={handleDelete} onClose={handleCloseDialog} />
        </Stack>
      </div>
      <AppBar className={styles.appbar} position='fixed'>
        <Toolbar>
          <IconButton color='inherit' onClick={onClose}>
            <ArrowBackIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default AuthInfoDetail
