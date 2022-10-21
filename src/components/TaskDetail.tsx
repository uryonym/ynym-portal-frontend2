import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DescriptionIcon from '@mui/icons-material/Description'
import { AppBar, Box, Button, IconButton, InputAdornment, TextField, Toolbar } from '@mui/material'
import { Stack } from '@mui/system'
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import axios from 'axios'
import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import DeleteConfirmDialog from './DeleteComfirmDialog'

import { fbAuth } from '@/lib/firebaseConfig'
import { Task, TaskList } from '@/models'
import styles from '@/styles/TaskDetail.module.scss'

type TaskDetailProps = {
  task: Task
  tab: number
  setTaskLists: Dispatch<SetStateAction<TaskList[]>>
  onClose: () => void
}

const TaskDetail: FC<TaskDetailProps> = ({ task, tab, setTaskLists, onClose }) => {
  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.productionUrl : process.env.developmentUrl

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [deadLine, setDeadLine] = useState<Date | undefined | null>(undefined)

  const [isOpen, setIsOpen] = useState<boolean>(false)

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
          description: description || null,
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
          setTaskLists((prevState) => {
            const tasks = prevState[tab].tasks.map((x) => (x.id === task.id ? response.data : x))
            prevState[tab].tasks = tasks
            return prevState
          })
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
        .delete(`${apiUrl}/tasks/${task.id}`, config)
        .then(() => {
          setTaskLists((prevState) => {
            const tasks = prevState[tab].tasks.filter((x) => x.id !== task.id)
            prevState[tab].tasks = tasks
            return prevState
          })
          onClose()
        })
        .catch((error) => console.log(error))
    })
  }

  const handleCloseDialog = () => {
    setIsOpen(false)
  }

  const handleClickComplete = () => {
    fbAuth.currentUser?.getIdToken(true).then((idToken) => {
      const data = {
        task: {
          is_complete: !task.is_complete,
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
          setTaskLists((prevState) => {
            const tasks = prevState[tab].tasks.map((x) => (x.id === task.id ? response.data : x))
            prevState[tab].tasks = tasks
            return prevState
          })
          onClose()
        })
        .catch((error) => console.log(error))
    })
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
          multiline
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
          <Box sx={{ flexGrow: 1 }} />
          <Button color='inherit' onClick={handleClickComplete}>
            {task.is_complete ? '未完了にする' : '完了にする'}
          </Button>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default TaskDetail
