import BottomAppBar from '@/components/BottomAppBar'
import TaskDetail from '@/components/TaskDetail'
import TaskNew from '@/components/TaskNew'
import { Task } from '@/models'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import axios from 'axios'
import type { NextPage } from 'next'
import { ChangeEvent, useEffect, useState } from 'react'
import styles from '@/styles/Task.module.scss'
import { ExpandMore } from '@mui/icons-material'
import { fbAuth } from '@/lib/firebaseConfig'

const Task: NextPage = () => {
  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.productionUrl : process.env.developmentUrl

  const [isNewOpen, setIsNewOpen] = useState<boolean>(false)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)
  const [task, setTask] = useState<Task>({ title: '' })
  const [tasks, setTasks] = useState<Task[]>([])

  const handleClickTask = (task: Task) => () => {
    setTask(task)
    setIsDetailOpen(true)
  }

  const handleChangeCheck = (id?: string) => (e: ChangeEvent<HTMLInputElement>) => {
    if (id) {
      fbAuth.currentUser?.getIdToken(true).then((idToken) => {
        const data = {
          task: {
            is_complete: e.target.checked,
          },
        }
        const config = {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
        axios
          .patch(`${apiUrl}/tasks/${id}`, data, config)
          .then((response) => {
            setTasks((tasks) => tasks.map((x) => (x.id === id ? response.data : x)))
          })
          .catch((error) => console.log(error))
      })
    }
  }

  useEffect(() => {
    fbAuth.currentUser?.getIdToken(true).then((idToken) => {
      const config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
      axios.get(`${apiUrl}/tasks`, config).then((response) => {
        setTasks(response.data)
      })
    })
  }, [])

  const taskList = tasks
    .filter((x) => !x.is_complete)
    .map((task: Task, index, array) => {
      return (
        <ListItem divider={array.length - 1 !== index} disablePadding key={task.id}>
          <ListItemButton dense>
            <ListItemIcon>
              <Checkbox disableRipple onChange={handleChangeCheck(task.id)} />
            </ListItemIcon>
            <ListItemText primary={task.title} onClick={handleClickTask(task)} />
          </ListItemButton>
        </ListItem>
      )
    })

  const taskCompletedList = tasks
    .filter((x) => x.is_complete)
    .map((task: Task, index, array) => {
      return (
        <ListItem divider={array.length - 1 !== index} disablePadding key={task.id}>
          <ListItemButton dense>
            <ListItemIcon>
              <Checkbox defaultChecked disableRipple onChange={handleChangeCheck(task.id)} />
            </ListItemIcon>
            <ListItemText
              primary={task.title}
              onClick={handleClickTask(task)}
              sx={{ textDecoration: 'line-through' }}
            />
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
        <Accordion variant='outlined'>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>完了済み</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <List>{taskCompletedList}</List>
          </AccordionDetails>
        </Accordion>
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
