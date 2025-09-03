import { useEffect, useMemo, useState } from 'react'
import api from '../../utils/api'
import { Box, Button, TextField, Paper, Stack, Alert, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import AppLayout from '../../layout/AppLayout'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
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

  const [sortKey] = useState<'name'|'price'|'stock'>('name')
  const [sortDir] = useState<'asc'|'desc'>('asc')
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return products
      .filter(p => !q || p.name.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q) || (p.category||'').toLowerCase().includes(q))
      .sort((a,b) => {
        const mul = sortDir === 'asc' ? 1 : -1
        if (sortKey === 'name') return a.name.localeCompare(b.name) * mul
        if (sortKey === 'price') return ((a.price||0) - (b.price||0)) * mul
        if (sortKey === 'stock') return (a.stockQuantity - b.stockQuantity) * mul
        return 0
      })
  }, [products, search, sortKey, sortDir])

  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null)

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'category', headerName: 'Category', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1.5 },
    { field: 'price', headerName: 'Price', type: 'number', width: 120 },
    { field: 'stockQuantity', headerName: 'Stock', type: 'number', width: 120,
      cellClassName: params => (params.row.lowStock ? 'low-stock' : '') as any },
    { field: 'actions', headerName: 'Actions', sortable: false, width: 200, renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <IconButton size="small" color="primary" onClick={() => { setEditing(params.row); setOpen(true) }}><EditIcon /></IconButton>
        <IconButton size="small" color="success" onClick={async () => { await api.post(`/products/${params.row.id}/increase`, null, { params: { qty: 1 } }); fetchProducts() }}><ArrowUpwardIcon /></IconButton>
        <IconButton size="small" color="warning" onClick={async () => { await api.post(`/products/${params.row.id}/decrease`, null, { params: { qty: 1 } }); fetchProducts() }}><ArrowDownwardIcon /></IconButton>
        <IconButton size="small" color="error" onClick={() => setConfirm({ id: params.row.id, name: params.row.name })}><DeleteIcon /></IconButton>
      </Stack>
    )},
  ]

  return (
    <AppLayout>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="contained" onClick={fetchProducts}>Search</Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => { setEditing(null); setOpen(true) }}>Add Product</Button>
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Paper sx={{ height: 560, width: '100%' }}>
          <DataGrid rows={filtered} columns={columns} getRowId={(r) => r.id} disableRowSelectionOnClick pageSizeOptions={[10,25,50]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
        </Paper>
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
        <Dialog open={!!confirm} onClose={() => setConfirm(null)}>
          <DialogTitle>Delete product</DialogTitle>
          <DialogContent>Are you sure you want to delete "{confirm?.name}"?</DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirm(null)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={async () => { if (confirm) { await api.delete(`/products/${confirm.id}`); setConfirm(null); fetchProducts() } }}>Delete</Button>
          </DialogActions>
        </Dialog>
    </AppLayout>
  )
}

export default ProductsPage

