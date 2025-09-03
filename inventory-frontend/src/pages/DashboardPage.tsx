import { Typography, Box, Paper } from '@mui/material'
import AppLayout from '../layout/AppLayout'

const DashboardPage = () => {
  return (
    <AppLayout>
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
    </AppLayout>
  )
}

export default DashboardPage

