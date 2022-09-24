import { AppBar, Box, Button, TextField, Toolbar } from '@mui/material'
import axios from 'axios'
import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'

import { fbAuth } from '@/lib/firebaseConfig'
import { AuthInfo } from '@/models'
import styles from '@/styles/TaskNew.module.scss'

type AuthInfoNewProps = {
  setAuthInfos: Dispatch<SetStateAction<AuthInfo[]>>
  onClose: () => void
}

const AuthInfoNew: FC<AuthInfoNewProps> = ({ setAuthInfos, onClose }) => {
  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.productionUrl : process.env.developmentUrl

  const [serviceName, setServiceName] = useState<string>('')
  const [loginId, setLoginId] = useState<string>('')
  const [password, setPassword] = useState<string>()
  const [other, setOther] = useState<string>()
  const serviceNameInputRef = useRef<HTMLInputElement>()

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
          password,
          other,
        },
      }
      const config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
      axios
        .post(`${apiUrl}/auth_infos`, data, config)
        .then((response) => {
          setAuthInfos((prevState) => [...prevState, response.data])
          onClose()
        })
        .catch((error) => console.log(error))
    })
  }

  useEffect(() => {
    if (serviceNameInputRef.current) {
      serviceNameInputRef.current.focus()
    }
  }, [])

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
          inputRef={serviceNameInputRef}
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
      </div>
      <AppBar className={styles.appbar} position='static' color='inherit'>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Button color='inherit' onClick={handleSave}>
            保存
          </Button>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default AuthInfoNew
