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
import Router from 'next/router'
import { FC, useState } from 'react'

import { logout } from '@/lib/firebaseAuth'
import styles from '@/styles/BottomAppBar.module.scss'

type BottomAppBarProps = {
  onAddItem?: () => void
}

const BottomAppBar: FC<BottomAppBarProps> = ({ onAddItem }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open)
  }

  const list = (
    <Box onClick={toggleDrawer(false)}>
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
          <IconButton color='inherit' onClick={toggleDrawer(true)}>
            <Menu />
          </IconButton>
          {onAddItem && (
            <Fab className={styles.fabBtn} color='secondary' onClick={onAddItem}>
              <Add />
            </Fab>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor='bottom' open={isOpen} onClose={toggleDrawer(false)}>
        {list}
      </Drawer>
    </>
  )
}

export default BottomAppBar
