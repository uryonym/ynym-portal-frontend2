import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material'
import { FC } from 'react'

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <Component {...pageProps} />
      </StyledEngineProvider>
    </ThemeProvider>
  )
}

export default MyApp
