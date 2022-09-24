import '../styles/globals.css'
import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { FC } from 'react'

import type { AppProps } from 'next/app'

import { AuthProvider } from '@/context/AuthContext'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <AuthProvider>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <Component {...pageProps} />
      </StyledEngineProvider>
    </AuthProvider>
  )
}

export default MyApp
