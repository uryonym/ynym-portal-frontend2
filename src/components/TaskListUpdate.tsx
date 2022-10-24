import { AppBar, Box, Button, TextField, Toolbar } from '@mui/material'
import axios from 'axios'
import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'

import { fbAuth } from '@/lib/firebaseConfig'
import { TaskList } from '@/models'
import styles from '@/styles/TaskListNew.module.scss'

type TaskListUpdateProps = {
  taskList: TaskList
  setTaskLists: Dispatch<SetStateAction<TaskList[]>>
  onClose: () => void
}

const TaskListUpdate: FC<TaskListUpdateProps> = ({ taskList, setTaskLists, onClose }) => {
  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.productionUrl : process.env.developmentUrl

  const [taskListName, setTaskListName] = useState<string>(taskList.name)
  const taskListNameInputRef = useRef<HTMLInputElement>()

  const handleChangeTaskListName = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskListName(e.target.value)
  }

  const handleSave = () => {
    fbAuth.currentUser?.getIdToken(true).then((idToken) => {
      const data = {
        task_list: {
          name: taskListName,
        },
      }
      const config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
      axios
        .patch(`${apiUrl}/task_lists/${taskList.id}`, data, config)
        .then(() => {
          setTaskLists((prevState) => {
            return prevState.map((x) => (x.id === taskList.id ? { ...x, name: taskListName } : x))
          })
          onClose()
        })
        .catch((error) => console.log(error))
    })
  }

  useEffect(() => {
    if (taskListNameInputRef.current) {
      taskListNameInputRef.current.focus()
    }
  }, [])

  return (
    <>
      <div className={styles.container}>
        <TextField
          className={styles.formControl}
          fullWidth
          placeholder='タスクリスト名'
          variant='standard'
          value={taskListName}
          onChange={handleChangeTaskListName}
          inputRef={taskListNameInputRef}
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

export default TaskListUpdate
