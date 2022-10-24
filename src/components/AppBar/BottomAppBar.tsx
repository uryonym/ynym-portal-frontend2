import { Add, Menu } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material'
import Router, { useRouter } from 'next/router'
import { Dispatch, FC, SetStateAction, useState } from 'react'

import TaskMenu from './TaskMenu'

import { logout } from '@/lib/firebaseAuth'
import { TaskList } from '@/models'
import styles from '@/styles/BottomAppBar.module.scss'

type BottomAppBarProps = {
  onAddItem?: () => void
  taskListId?: string
  setTaskLists?: Dispatch<SetStateAction<TaskList[]>>
}

const BottomAppBar: FC<BottomAppBarProps> = ({ onAddItem, taskListId, setTaskLists }) => {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const list = (
    <Box onClick={() => setIsOpen(false)}>
      <List className={styles.list}>
        <ListItem>
          <ListItemButton onClick={() => Router.push('/')}>
            <ListItemText primary='ホーム' />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => Router.push('task')}>
            <ListItemText primary='タスク' />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => Router.push('authInfo')}>
            <ListItemText primary='機密情報' />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List className={styles.list}>
        <ListItem>
          <ListItemButton onClick={() => logout()}>
            <ListItemText primary='ログアウト' />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <>
      <AppBar className={styles.appbar} position='fixed'>
        <Toolbar>
          <IconButton color='inherit' onClick={() => setIsOpen(true)}>
            <Menu />
          </IconButton>
          <Drawer anchor='bottom' open={isOpen} onClose={() => setIsOpen(false)}>
            {list}
          </Drawer>
          {onAddItem && (
            <Fab className={styles.fabBtn} color='secondary' onClick={onAddItem}>
              <Add />
            </Fab>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {router.pathname == '/task' && taskListId && setTaskLists && <TaskMenu taskListId={taskListId} setTaskLists={setTaskLists} />}
        </Toolbar>
      </AppBar>
    </>
  )
}

export default BottomAppBar
