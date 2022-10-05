import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import { FC } from 'react'

type DeleteConfirmDialogProps = {
  open: boolean
  onExec: () => void
  onClose: () => void
}

const DeleteConfirmDialog: FC<DeleteConfirmDialogProps> = ({ open, onExec, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>本当に削除して良いですか？</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={onExec} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmDialog
