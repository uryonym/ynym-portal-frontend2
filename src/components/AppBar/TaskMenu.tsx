import { MoreVert } from '@mui/icons-material'
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import axios from 'axios'
import { Dispatch, FC, SetStateAction, useState } from 'react'

import DeleteConfirmDialog from '../DeleteComfirmDialog'
import TaskListNew from '../TaskListNew'
import TaskListUpdate from '../TaskListUpdate'

import { fbAuth } from '@/lib/firebaseConfig'
import { TaskList } from '@/models'
import styles from '@/styles/BottomAppBar.module.scss'

type TaskMenuProps = {
  taskList: TaskList
  setTaskLists: Dispatch<SetStateAction<TaskList[]>>
}

const TaskMenu: FC<TaskMenuProps> = ({ taskList, setTaskLists }) => {
  const apiUrl = process.env.NODE_ENV === 'production' ? process.env.productionUrl : process.env.developmentUrl

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isListNewOpen, setIsListNewOpen] = useState<boolean>(false)
  const [isListUpdateOpen, setIsListUpdateOpen] = useState<boolean>(false)
  const [isListDeleteOpen, setIsListDeleteOpen] = useState<boolean>(false)

  const handleClickAddList = () => {
    setIsListNewOpen(true)
  }

  const handleClickRenameList = () => {
    setIsListUpdateOpen(true)
  }

  const handleClickDeleteList = () => {
    setIsListDeleteOpen(true)
  }

  const handleDeleteList = () => {
    setIsListDeleteOpen(false)

    fbAuth.currentUser?.getIdToken(true).then((idToken) => {
      const config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
      axios
        .delete(`${apiUrl}/task_lists/${taskList.id}`, config)
        .then(() => {
          setTaskLists((prevState) => {
            return prevState.filter((x) => x.id !== taskList.id)
          })
        })
        .catch((error) => console.log(error))
    })
  }

  const handleCloseDialog = () => {
    setIsListDeleteOpen(false)
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
          <ListItemButton onClick={handleClickDeleteList}>
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
      <DeleteConfirmDialog open={isListDeleteOpen} onExec={handleDeleteList} onClose={handleCloseDialog} />
    </>
  )
}

export default TaskMenu
