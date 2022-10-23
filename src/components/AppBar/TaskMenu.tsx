import { MoreVert } from '@mui/icons-material'
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { FC, useState } from 'react'

import styles from '@/styles/BottomAppBar.module.scss'

const TaskMenu: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const list = (
    <Box onClick={() => setIsOpen(false)}>
      <List className={styles.list}>
        <ListItem>
          <ListItemButton onClick={() => console.log('リストを新規作成します')}>
            <ListItemText primary='リストを作成' />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => console.log('リストの名前を変更します')}>
            <ListItemText primary='リストの名前を変更' />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List className={styles.list}>
        <ListItem>
          <ListItemButton onClick={() => console.log('リストを削除します')}>
            <ListItemText primary='リストを削除' />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <>
      <IconButton color='inherit' onClick={() => setIsOpen(true)}>
        <MoreVert />
      </IconButton>
      <Drawer anchor='bottom' open={isOpen} onClose={() => setIsOpen(false)}>
        {list}
      </Drawer>
    </>
  )
}

export default TaskMenu
