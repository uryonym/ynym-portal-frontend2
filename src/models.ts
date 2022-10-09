export type TaskList = {
  id?: string
  name: string
  uid?: string
  share_uid?: string
  tasks: Task[]
}

export type Task = {
  id?: string
  title: string
  description?: string
  dead_line?: Date
  is_complete?: Boolean
}

export type AuthInfo = {
  id?: string
  service_name: string
  login_id: string
  password?: string
  other?: string
}
