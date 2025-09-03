import { useEffect, useState } from 'react'
import api from '../../utils/api'
import { Typography, Box, Button, Paper, Stack } from '@mui/material'
import AppLayout from '../../layout/AppLayout'
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
    <AppLayout>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button variant="outlined" onClick={() => {
            const rows = (stock?.lowStock || []).map((p: any) => ({ name: p.name, stock: p.stockQuantity, threshold: p.threshold }))
            import('../../utils/export').then(m => m.exportToCsv('low-stock.csv', rows))
          }}>Export Low Stock CSV</Button>
          <Button variant="outlined" onClick={() => {
            const rows = Object.entries(sales?.productTotals || {}).map(([k, v]) => ({ productId: k, total: v }))
            import('../../utils/export').then(m => m.exportToCsv('sales-summary.csv', rows))
          }}>Export Sales Summary CSV</Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/reports/stock.xlsx`, '_blank')}>Download Stock Excel</Button>
          <Button variant="contained" onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/reports/sales.xlsx?period=weekly`, '_blank')}>Download Sales Excel</Button>
          <Button variant="contained" onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/reports/stock.pdf`, '_blank')}>Download Stock PDF</Button>
          <Button variant="contained" onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/reports/sales.pdf?period=weekly`, '_blank')}>Download Sales PDF</Button>
        </Stack>
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
    </AppLayout>
  )
}

export default ReportsPage

