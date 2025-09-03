import { useEffect, useState } from 'react'
import api from '../../utils/api'
import { AppBar, Toolbar, Typography, Box, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { Link } from 'react-router-dom'

type Audit = { id: string; userId: string; action: string; details: string; timestamp: string }

const AuditLogsPage = () => {
  const [logs, setLogs] = useState<Audit[]>([])
  useEffect(() => { (async () => { const { data } = await api.get('/audit'); setLogs(data) })() }, [])
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Audit Logs</Typography>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/products">Products</Button>
          <Button color="inherit" component={Link} to="/sales">Sales</Button>
          <Button color="inherit" component={Link} to="/reports">Reports</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map(l => (
                <TableRow key={l.id}>
                  <TableCell>{new Date(l.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{l.userId}</TableCell>
                  <TableCell>{l.action}</TableCell>
                  <TableCell>{l.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default AuditLogsPage

