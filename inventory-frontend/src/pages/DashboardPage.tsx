import { AppBar, Toolbar, Typography, Box, Button, Paper } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store/useStore'
import { logout } from '../store/slices/authSlice'

const DashboardPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const onLogout = () => {
    dispatch(logout())
    navigate('/login')
  }
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Inventory Dashboard</Typography>
          <Button color="inherit" component={Link} to="/products">Products</Button>
          <Button color="inherit" component={Link} to="/sales">Sales</Button>
          <Button color="inherit" component={Link} to="/reports">Reports</Button>
          <Button color="inherit" onClick={onLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Products</Typography>
            <Typography variant="h4">—</Typography>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Stock Value</Typography>
            <Typography variant="h4">—</Typography>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Sales</Typography>
            <Typography variant="h4">—</Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardPage

