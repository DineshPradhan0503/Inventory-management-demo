import { useEffect, useState } from 'react'
import api from '../../utils/api'
import { Button, Paper, Stack, TextField, Alert, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import AppLayout from '../../layout/AppLayout'

type Product = { id: string; name: string }
type Sale = { id: string; productId: string; quantity: number; saleTime: string; soldByUserId: string }

const SalesPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [productId, setProductId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      const { data } = await api.get('/products', { params: { page: 0, size: 100 } })
      setProducts(data.content.map((p: any) => ({ id: p.id, name: p.name })))
      const salesRes = await api.get('/sales')
      setSales(salesRes.data)
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to load data')
    }
  }

  const record = async () => {
    setError(null)
    try {
      await api.post('/sales', { productId, quantity })
      await load()
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to record sale')
    }
  }

  useEffect(() => { load() }, [])

  return (
    <AppLayout>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Product ID" value={productId} onChange={(e) => setProductId(e.target.value)} select SelectProps={{ native: true }}>
              <option value=""></option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </TextField>
            <TextField label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value || '1'))} />
            <Button variant="contained" onClick={record}>Record Sale</Button>
          </Stack>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Sold By</TableCell>
                <TableCell>Sale Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.productId}</TableCell>
                  <TableCell>{s.quantity}</TableCell>
                  <TableCell>{s.soldByUserId}</TableCell>
                  <TableCell>{new Date(s.saleTime).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </AppLayout>
  )
}

export default SalesPage

