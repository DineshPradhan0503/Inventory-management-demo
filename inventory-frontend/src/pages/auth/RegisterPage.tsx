import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Container, Paper, Stack, TextField, Typography, Alert } from '@mui/material'
import { useAppDispatch } from '../../store/useStore'
import { register as registerThunk } from '../../store/slices/authSlice'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const schema = z.object({
  username: z.string().min(3, 'Min 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
})
type FormValues = z.infer<typeof schema>

const RegisterPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    setError(null)
    try {
      await dispatch(registerThunk(values)).unwrap()
      navigate('/')
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Register</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            <TextField label="Username" {...register('username')} error={!!errors.username} helperText={errors.username?.message} />
            <TextField label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
            <TextField label="Password" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
            <Button type="submit" variant="contained" disabled={isSubmitting}>Register</Button>
            <Typography variant="body2">Have an account? <Link to="/login">Login</Link></Typography>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default RegisterPage

