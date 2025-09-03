import { useEffect, useMemo, useState } from 'react'
import api from '../../utils/api'
import { AppBar, Toolbar, Typography, Box, Button, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Alert } from '@mui/material'
import { Link } from 'react-router-dom'

type Product = {
  id: string
  name: string
  category: string
  description: string
  price: number
  stockQuantity: number
  threshold: number
  lowStock: boolean
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    setError(null)
    try {
      const { data } = await api.get('/products', { params: { page: 0, size: 100, search } })
      setProducts(data.content)
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to load products')
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const filtered = useMemo(() => products, [products])

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Products</Typography>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/sales">Sales</Button>
          <Button color="inherit" component={Link} to="/reports">Reports</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="contained" onClick={fetchProducts}>Search</Button>
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} hover selected={p.lowStock}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell align="right">{p.price}</TableCell>
                  <TableCell align="right" style={{ color: p.lowStock ? 'red' : undefined }}>{p.stockQuantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default ProductsPage

