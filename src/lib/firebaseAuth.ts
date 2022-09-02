import {
  GoogleAuthProvider,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  signInWithRedirect,
  signOut,
} from 'firebase/auth'
import { fbAuth } from './firebaseConfig'

export type User = {
  uid?: string
  displayName?: string | null
  email?: string | null
  idToken?: string
}

const provider = new GoogleAuthProvider()

export const login = () => {
  signInWithRedirect(fbAuth, provider)
}

export const logout = () => {
  signOut(fbAuth)
}

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  onFirebaseAuthStateChanged(fbAuth, (user) => {
    const userInfo: User | null = user
      ? {
          displayName: user?.displayName,
          email: user?.email,
        }
      : null
    callback(userInfo)
  })
}
