import BottomAppBar from '@/components/BottomAppBar'
import TaskDetail from '@/components/TaskDetail'
import TaskNew from '@/components/TaskNew'
import { Task } from '@/models'
import {
  Checkbox,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
} from '@mui/material'
import axios from 'axios'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import styles from '@/styles/Task.module.scss'

const Task: NextPage = () => {
  const [isNewOpen, setIsNewOpen] = useState<boolean>(false)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)
  const [task, setTask] = useState<Task>({ title: '' })
  const [tasks, setTasks] = useState<Task[]>([])

  const handleClickTask = (task: Task) => () => {
    setTask(task)
    setIsDetailOpen(true)
  }

  useEffect(() => {
    axios.get('http://portal.uryonym.com:5000/api/v1/tasks').then((response) => {
      setTasks(response.data)
    })
  }, [])

  const taskList = tasks
    .filter((x) => !x.is_complete)
    .map((task: Task, index, array) => {
      return (
        <ListItem divider={array.length - 1 !== index} disablePadding key={task.id}>
          <ListItemButton dense onClick={handleClickTask(task)}>
            <ListItemIcon>
              <Checkbox disableRipple />
            </ListItemIcon>
            <ListItemText primary={task.title} />
          </ListItemButton>
        </ListItem>
      )
    })

  const taskCompletedList = tasks
    .filter((x) => x.is_complete)
    .map((task: Task, index, array) => {
      return (
        <ListItem divider={array.length - 1 !== index} disablePadding key={task.id}>
          <ListItemButton dense onClick={handleClickTask(task)}>
            <ListItemIcon>
              <Checkbox defaultChecked disableRipple />
            </ListItemIcon>
            <ListItemText primary={task.title} />
          </ListItemButton>
        </ListItem>
      )
    })

  return (
    <>
      <div className={styles.container}>
        <h2>タスク</h2>
        <Paper variant='outlined' sx={{ marginBottom: '10px' }}>
          <List>{taskList}</List>
        </Paper>
        <Paper variant='outlined'>
          <List subheader={<ListSubheader component='div'>完了済</ListSubheader>}>{taskCompletedList}</List>
        </Paper>
      </div>
      <Drawer anchor='bottom' open={isNewOpen} onClose={() => setIsNewOpen(false)}>
        <TaskNew setTasks={setTasks} onClose={() => setIsNewOpen(false)} />
      </Drawer>
      <Drawer className={styles.drawer} anchor='right' open={isDetailOpen} onClose={() => setIsDetailOpen(false)}>
        <TaskDetail task={task} setTasks={setTasks} onClose={() => setIsDetailOpen(false)} />
      </Drawer>
      <BottomAppBar onAddTask={() => setIsNewOpen(true)} />
    </>
  )
}

export default Task
