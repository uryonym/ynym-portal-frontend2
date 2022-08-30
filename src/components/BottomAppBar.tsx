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
import { FC, useState } from 'react'
import styles from '@/styles/BottomAppBar.module.scss'

type BottomAppBarProps = {
  onAddTask: () => void
}

const BottomAppBar: FC<BottomAppBarProps> = ({ onAddTask }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open)
  }

  const list = (
    <Box onClick={toggleDrawer(false)}>
      <List className={styles.list}>
        <ListItem>
          <ListItemButton>
            <ListItemText primary='ホーム' />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <ListItemText primary='タスク' />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List className={styles.list}>
        <ListItem>
          <ListItemButton>
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
          <IconButton color='inherit' onClick={toggleDrawer(true)}>
            <Menu />
          </IconButton>
          <Fab className={styles.fabBtn} color='secondary' onClick={onAddTask}>
            <Add />
          </Fab>
        </Toolbar>
      </AppBar>
      <Drawer anchor='bottom' open={isOpen} onClose={toggleDrawer(false)}>
        {list}
      </Drawer>
    </>
  )
}

export default BottomAppBar
