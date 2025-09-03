import { useEffect, useState } from 'react'
import api from '../../utils/api'
import { AppBar, Toolbar, Typography, Box, Button, Paper } from '@mui/material'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const ReportsPage = () => {
  const [stock, setStock] = useState<any>(null)
  const [sales, setSales] = useState<any>(null)

  const load = async () => {
    const stockRes = await api.get('/reports/stock')
    setStock(stockRes.data)
    const salesRes = await api.get('/reports/sales', { params: { period: 'weekly' } })
    setSales(salesRes.data)
  }

  useEffect(() => { load() }, [])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const stockData = stock?.lowStock?.map((p: any) => ({ name: p.name, stock: p.stockQuantity })) || []
  const productTotalsData = sales ? Object.entries(sales.productTotals || {}).map(([k, v]) => ({ name: k, value: v as number })) : []

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Reports</Typography>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/products">Products</Button>
          <Button color="inherit" component={Link} to="/sales">Sales</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <Paper sx={{ p: 2, height: 360 }}>
            <Typography variant="h6">Low Stock Overview</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockData}>
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
          <Paper sx={{ p: 2, height: 360 }}>
            <Typography variant="h6">Best Sellers (Weekly)</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie dataKey="value" data={productTotalsData} outerRadius={120}>
                  {productTotalsData.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default ReportsPage

