import { MoreVert } from '@mui/icons-material'
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { Dispatch, FC, SetStateAction, useState } from 'react'

import TaskListNew from '../TaskListNew'
import TaskListUpdate from '../TaskListUpdate'

import { TaskList } from '@/models'
import styles from '@/styles/BottomAppBar.module.scss'

type TaskMenuProps = {
  taskList: TaskList
  setTaskLists: Dispatch<SetStateAction<TaskList[]>>
}

const TaskMenu: FC<TaskMenuProps> = ({ taskList, setTaskLists }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isListNewOpen, setIsListNewOpen] = useState<boolean>(false)
  const [isListUpdateOpen, setIsListUpdateOpen] = useState<boolean>(false)

  const handleClickAddList = () => {
    setIsListNewOpen(true)
  }

  const handleClickRenameList = () => {
    setIsListUpdateOpen(true)
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
          <ListItemButton onClick={handleClickRenameList}>
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
      <Drawer anchor='bottom' open={isListUpdateOpen} onClose={() => setIsListUpdateOpen(false)}>
        <TaskListUpdate taskList={taskList} setTaskLists={setTaskLists} onClose={() => setIsListUpdateOpen(false)} />
      </Drawer>
    </>
  )
}

export default TaskMenu
