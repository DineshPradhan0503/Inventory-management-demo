import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Container, Paper, Stack, TextField, Typography, Alert } from '@mui/material'
import { useAppDispatch } from '../../store/useStore'
import { login } from '../../store/slices/authSlice'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const schema = z.object({
  usernameOrEmail: z.string().min(1, 'Required'),
  password: z.string().min(6, 'Min 6 characters'),
})
type FormValues = z.infer<typeof schema>

const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { register: rhfRegister, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    setError(null)
    try {
      await dispatch(login(values)).unwrap()
      navigate('/')
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Login failed')
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            <TextField label="Username or Email" {...rhfRegister('usernameOrEmail')} error={!!errors.usernameOrEmail} helperText={errors.usernameOrEmail?.message} />
            <TextField label="Password" type="password" {...rhfRegister('password')} error={!!errors.password} helperText={errors.password?.message} />
            <Button type="submit" variant="contained" disabled={isSubmitting}>Login</Button>
            <Typography variant="body2">No account? <Link to="/register">Register</Link></Typography>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default LoginPage

