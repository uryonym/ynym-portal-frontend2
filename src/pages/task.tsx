import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import axios from 'axios'
import Router from 'next/router'
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react'

import type { NextPage } from 'next'

import BottomAppBar from '@/components/BottomAppBar'
import TaskDetail from '@/components/TaskDetail'
import TaskNew from '@/components/TaskNew'
import { useAuthContext } from '@/context/AuthContext'
import { fbAuth } from '@/lib/firebaseConfig'
import { Task, TaskList } from '@/models'
import styles from '@/styles/Task.module.scss'

const Task: NextPage = () => {
  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.productionUrl : process.env.developmentUrl

  const { currentUser } = useAuthContext()

  const [isNewOpen, setIsNewOpen] = useState<boolean>(false)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)
  const [task, setTask] = useState<Task>({ title: '' })
  const [taskLists, setTaskLists] = useState<TaskList[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [tab, setTab] = useState<number>(0)

  const handleChangeTab = (e: SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const handleClickAddList = () => {
    console.log('リスト追加ボタンを謳歌しました。')
  }

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

      // タスクリストの取得
      axios.get(`${apiUrl}/task_lists`, config).then((response) => {
        setTaskLists(response.data)
      })

      // タスクの取得
      axios.get(`${apiUrl}/tasks`, config).then((response) => {
        setTasks(response.data)
      })
    })
  }, [currentUser])

  const taskListTabs = taskLists.map((taskList: TaskList, index: number) => {
    return <Tab label={taskList.name} key={index} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} />
  })

  const dispTasks = (tasks: Task[]) =>
    tasks
      .filter((x) => !x.is_complete)
      .map((task: Task, index: number, array: Task[]) => {
        const dispDeadLine = task.dead_line ? task.dead_line.toString() : ''
        return (
          <ListItem divider={array.length - 1 !== index} disablePadding key={task.id}>
            <ListItemButton dense>
              <ListItemIcon>
                <Checkbox disableRipple onChange={handleChangeCheck(task.id)} />
              </ListItemIcon>
              <ListItemText primary={task.title} secondary={dispDeadLine} onClick={handleClickTask(task)} />
            </ListItemButton>
          </ListItem>
        )
      })

  const dispCompletedTasks = (tasks: Task[]) =>
    tasks
      .filter((x) => x.is_complete)
      .map((task: Task, index, array) => {
        const dispDeadLine = task.dead_line ? task.dead_line.toString() : ''
        return (
          <ListItem divider={array.length - 1 !== index} disablePadding key={task.id}>
            <ListItemButton dense>
              <ListItemIcon>
                <Checkbox defaultChecked disableRipple onChange={handleChangeCheck(task.id)} />
              </ListItemIcon>
              <ListItemText
                primary={task.title}
                secondary={dispDeadLine}
                onClick={handleClickTask(task)}
                sx={{ textDecoration: 'line-through' }}
              />
            </ListItemButton>
          </ListItem>
        )
      })

  const tabPanels = taskLists.map((taskList: TaskList, index: number) => {
    return (
      <div role='tabpanel' hidden={tab !== index} key={index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
        {tab === index && (
          <Box>
            <Paper variant='outlined' sx={{ marginBottom: '10px' }}>
              <List>{dispTasks(taskList.tasks)}</List>
            </Paper>
            <Accordion variant='outlined'>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>完了済み</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0 }}>
                <List>{dispCompletedTasks(taskList.tasks)}</List>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </div>
    )
  })

  return (
    <>
      <div className={styles.container}>
        <h2>タスク</h2>
        <Box>
          <Tabs value={tab} onChange={handleChangeTab}>
            {taskListTabs}
            <Button variant='text' onClick={handleClickAddList}>
              ＋リストの追加
            </Button>
          </Tabs>
        </Box>
        {tabPanels}
      </div>
      <Drawer anchor='bottom' open={isNewOpen} onClose={() => setIsNewOpen(false)}>
        <TaskNew setTasks={setTasks} onClose={() => setIsNewOpen(false)} />
      </Drawer>
      <Drawer className={styles.drawer} anchor='right' open={isDetailOpen} onClose={() => setIsDetailOpen(false)}>
        <TaskDetail task={task} setTasks={setTasks} onClose={() => setIsDetailOpen(false)} />
      </Drawer>
      <BottomAppBar onAddItem={() => setIsNewOpen(true)} />
    </>
  )
}

export default Task
