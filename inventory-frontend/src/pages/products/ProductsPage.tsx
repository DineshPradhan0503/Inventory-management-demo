import { useEffect, useMemo, useState } from 'react'
import api from '../../utils/api'
import { AppBar, Toolbar, Typography, Box, Button, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, Alert, IconButton } from '@mui/material'
import { Link } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ProductDialog, { type ProductFormValues } from '../../components/ProductDialog'

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
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

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
          <Box sx={{ flexGrow: 1 }} />
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => { setEditing(null); setOpen(true) }}>Add Product</Button>
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
                <TableCell align="right">Actions</TableCell>
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
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" color="primary" onClick={() => { setEditing(p); setOpen(true) }}><EditIcon /></IconButton>
                      <IconButton size="small" color="success" onClick={async () => { await api.post(`/products/${p.id}/increase`, null, { params: { qty: 1 } }); fetchProducts() }}><ArrowUpwardIcon /></IconButton>
                      <IconButton size="small" color="warning" onClick={async () => { await api.post(`/products/${p.id}/decrease`, null, { params: { qty: 1 } }); fetchProducts() }}><ArrowDownwardIcon /></IconButton>
                      <IconButton size="small" color="error" onClick={async () => { await api.delete(`/products/${p.id}`); fetchProducts() }}><DeleteIcon /></IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ProductDialog
          open={open}
          initial={editing || undefined}
          onClose={() => setOpen(false)}
          onSubmit={async (v: ProductFormValues) => {
            if (editing) {
              await api.put(`/products/${editing.id}`, v)
            } else {
              await api.post('/products', v)
            }
            setOpen(false)
            fetchProducts()
          }}
        />
      </Box>
    </Box>
  )
}

export default ProductsPage

