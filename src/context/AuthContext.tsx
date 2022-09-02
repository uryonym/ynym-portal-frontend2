import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from '@/lib/firebaseAuth'

type AuthContextProps = {
  currentUser?: User | null
}

const AuthContext = createContext<AuthContextProps>({ currentUser: undefined })

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>()

  useEffect(() => {
    onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
  }, [])

  return <AuthContext.Provider value={{ currentUser: currentUser }}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
