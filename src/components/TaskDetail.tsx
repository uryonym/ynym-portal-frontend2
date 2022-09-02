import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DescriptionIcon from '@mui/icons-material/Description'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { AppBar, Box, Button, IconButton, InputAdornment, TextField, Toolbar } from '@mui/material'
import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import axios from 'axios'
import styles from '@/styles/TaskDetail.module.scss'
import { Task } from '@/models'
import { Stack } from '@mui/system'
import { fbAuth } from '@/lib/firebaseConfig'

type TaskDetailProps = {
  task: Task
  setTasks: Dispatch<SetStateAction<Task[]>>
  onClose: () => void
}

const TaskDetail: FC<TaskDetailProps> = ({ task, setTasks, onClose }) => {
  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.productionUrl : process.env.developmentUrl

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [deadLine, setDeadLine] = useState<Date | undefined | null>(undefined)

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }

  const handleSave = () => {
    fbAuth.currentUser?.getIdToken(true).then((idToken) => {
      const data = {
        task: {
          title,
          description,
          dead_line: deadLine,
        },
      }
      const config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
      axios
        .patch(`${apiUrl}/tasks/${task.id}`, data, config)
        .then((response) => {
          setTasks((prevState) => prevState.map((x) => (x.id === task.id ? response.data : x)))
          onClose()
        })
        .catch((error) => console.log(error))
    })
  }

  const handleDelete = () => {
    fbAuth.currentUser?.getIdToken(true).then((idToken) => {
      const config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
      axios
        .delete(`${apiUrl}/tasks/${task.id}`, config)
        .then(() => {
          setTasks((prevState) => prevState.filter((x) => x.id !== task.id))
          onClose()
        })
        .catch((error) => console.log(error))
    })
  }

  const handleClickComplete = () => {
    const data = {
      task: {
        is_complete: !task.is_complete,
      },
    }

    axios
      .patch(`${apiUrl}/tasks/${task.id}`, data)
      .then((response) => {
        setTasks((prevState) => prevState.map((x) => (x.id === task.id ? response.data : x)))
        onClose()
      })
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description || '')
    setDeadLine(task.dead_line)
  }, [task])

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

        <TextField
          className={styles.formControl}
          multiline
          fullWidth
          placeholder='詳細を入力'
          variant='standard'
          value={description}
          onChange={handleChangeDescription}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <DescriptionIcon />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction='row' justifyContent='space-between'>
          <Button variant='outlined' onClick={handleSave}>
            保存
          </Button>
          <Button variant='outlined' color='error' onClick={handleDelete}>
            削除
          </Button>
        </Stack>
      </div>
      <AppBar className={styles.appbar} position='fixed'>
        <Toolbar>
          <IconButton color='inherit' onClick={onClose}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Button color='inherit' onClick={handleClickComplete}>
            {task.is_complete ? '未完了' : '完了'}
          </Button>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default TaskDetail
