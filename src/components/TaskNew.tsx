import { AppBar, Box, Button, InputAdornment, TextField, Toolbar } from '@mui/material'
import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import axios from 'axios'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import styles from '@/styles/TaskNew.module.scss'
import { Task } from '@/models'

type TaskNewProps = {
  setTasks: Dispatch<SetStateAction<Task[]>>
  onClose: () => void
}

const TaskNew: FC<TaskNewProps> = ({ setTasks, onClose }) => {
  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.productionUrl : process.env.developmentUrl

  const [title, setTitle] = useState<string>('')
  const [deadLine, setDeadLine] = useState<Date | null>(null)
  const titleInputRef = useRef<HTMLInputElement>()

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleSave = () => {
    const data = {
      task: {
        title,
        dead_line: deadLine,
      },
    }
    axios
      .post(`${apiUrl}/tasks`, data)
      .then((response) => {
        setTasks((prevState) => [...prevState, response.data])
        onClose()
      })
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [])

  return (
    <>
      <div className={styles.container}>
        <TextField
          className={`${styles.formControl} ${styles.taskTitle}`}
          fullWidth
          placeholder='タスクを入力'
          variant='standard'
          value={title}
          onChange={handleChangeTitle}
          inputRef={titleInputRef}
        />
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <MobileDatePicker
            value={deadLine}
            onChange={(newValue) => {
              setDeadLine(newValue)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                className={styles.formControl}
                fullWidth
                variant='standard'
                placeholder='期限を入力'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <CalendarMonthIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </LocalizationProvider>
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

export default TaskNew
