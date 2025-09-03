import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { ColorModeProvider } from './theme/ColorModeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ColorModeProvider>
          <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
            <App />
          </SnackbarProvider>
        </ColorModeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
