import { MoreVert } from '@mui/icons-material'
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { Dispatch, FC, SetStateAction, useState } from 'react'

import TaskListNew from '../TaskListNew'

import { TaskList } from '@/models'
import styles from '@/styles/BottomAppBar.module.scss'

type TaskMenuProps = {
  taskListId: string
  setTaskLists: Dispatch<SetStateAction<TaskList[]>>
}

const TaskMenu: FC<TaskMenuProps> = ({ taskListId, setTaskLists }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isListNewOpen, setIsListNewOpen] = useState<boolean>(false)

  const handleClickAddList = () => {
    setIsListNewOpen(true)
  }

  const list = (
    <Box onClick={() => setIsOpen(false)}>
      <List className={styles.list}>
        <ListItem>
          <ListItemButton onClick={handleClickAddList}>
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
      <Drawer anchor='bottom' open={isListNewOpen} onClose={() => setIsListNewOpen(false)}>
        <TaskListNew setTaskLists={setTaskLists} onClose={() => setIsListNewOpen(false)} />
      </Drawer>
    </>
  )
}

export default TaskMenu
