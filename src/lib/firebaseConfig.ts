import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.firebaseApiKey,
  authDomain: process.env.firebaseAuthDomain,
  projectId: process.env.firebaseProjectId,
  appId: process.env.firebaseAppId,
}

const firebaseApp = initializeApp(firebaseConfig)

export const fbAuth = getAuth(firebaseApp)
export { firebaseApp }
