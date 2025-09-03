import { createContext, useMemo, useState, useContext, useEffect } from 'react'
import type { PropsWithChildren } from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

type ColorMode = 'light' | 'dark'

const ColorModeContext = createContext<{ mode: ColorMode; toggle: () => void }>({ mode: 'light', toggle: () => {} })

export const useColorMode = () => useContext(ColorModeContext)

export const ColorModeProvider = ({ children }: PropsWithChildren) => {
  const [mode, setMode] = useState<ColorMode>((localStorage.getItem('color-mode') as ColorMode) || 'light')
  useEffect(() => { localStorage.setItem('color-mode', mode) }, [mode])
  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'))
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode])
  return (
    <ColorModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

