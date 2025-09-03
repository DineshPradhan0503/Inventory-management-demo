import { AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Tooltip } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useState } from 'react'
import type { PropsWithChildren } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useColorMode } from '../theme/ColorModeProvider'
import { useAppSelector, useAppDispatch } from '../store/useStore'
import { logout } from '../store/slices/authSlice'

const AppLayout = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false)
  const { mode, toggle } = useColorMode()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const roles = useAppSelector(s => s.auth.roles)
  const isAdmin = roles?.includes('ADMIN')
  const location = useLocation()

  const items = [
    { to: '/', label: 'Dashboard' },
    { to: '/products', label: 'Products' },
    { to: '/sales', label: 'Sales' },
    { to: '/reports', label: 'Reports', admin: true },
    { to: '/audit', label: 'Audit Logs', admin: true },
  ].filter(i => !i.admin || isAdmin)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" onClick={() => setOpen(true)}><MenuIcon /></IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>Inventory</Typography>
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton color="inherit" onClick={toggle}>
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={() => { dispatch(logout()); navigate('/login') }}>⎋</IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation" onClick={() => setOpen(false)}>
          <List>
            {items.map(i => (
              <ListItem key={i.to} disablePadding>
                <ListItemButton component={Link} to={i.to} selected={location.pathname === i.to}>
                  <ListItemText primary={i.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>{children}</Box>
    </Box>
  )
}

export default AppLayout

