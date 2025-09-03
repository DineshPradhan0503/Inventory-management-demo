import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'

export type ProductFormValues = {
  name: string
  category: string
  description: string
  price: number
  stockQuantity: number
  threshold: number
}

const defaultValues: ProductFormValues = {
  name: '',
  category: '',
  description: '',
  price: 0,
  stockQuantity: 0,
  threshold: 0,
}

const ProductDialog = ({ open, onClose, onSubmit, initial }: {
  open: boolean
  onClose: () => void
  onSubmit: (v: ProductFormValues) => void
  initial?: Partial<ProductFormValues>
}) => {
  const { register, handleSubmit, reset } = useForm<ProductFormValues>({
    defaultValues: { ...defaultValues, ...(initial || {}) },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial?.name ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Name" {...register('name', { required: true })} />
          <TextField label="Category" {...register('category')} />
          <TextField label="Description" {...register('description')} />
          <TextField label="Price" type="number" inputProps={{ step: '0.01' }} {...register('price', { valueAsNumber: true })} />
          <TextField label="Initial Stock" type="number" {...register('stockQuantity', { valueAsNumber: true })} />
          <TextField label="Threshold" type="number" {...register('threshold', { valueAsNumber: true })} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductDialog

