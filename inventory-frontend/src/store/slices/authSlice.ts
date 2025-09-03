import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

type AuthState = {
  token: string | null
  username: string | null
  email: string | null
  roles: string[]
  status: 'idle' | 'loading' | 'failed'
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  username: localStorage.getItem('username'),
  email: localStorage.getItem('email'),
  roles: JSON.parse(localStorage.getItem('roles') || '[]'),
  status: 'idle',
}

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { usernameOrEmail: string; password: string }) => {
    const { data } = await api.post('/auth/login', payload)
    return data
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload: { username: string; email: string; password: string }) => {
    const { data } = await api.post('/auth/register', payload)
    return data
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.username = null
      state.email = null
      state.roles = []
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('email')
      localStorage.removeItem('roles')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle'
        state.token = action.payload.token
        state.username = action.payload.username
        state.email = action.payload.email
        state.roles = action.payload.roles || []
        localStorage.setItem('token', state.token || '')
        localStorage.setItem('username', state.username || '')
        localStorage.setItem('email', state.email || '')
        localStorage.setItem('roles', JSON.stringify(state.roles))
      })
      .addCase(login.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'idle'
        state.token = action.payload.token
        state.username = action.payload.username
        state.email = action.payload.email
        state.roles = action.payload.roles || []
        localStorage.setItem('token', state.token || '')
        localStorage.setItem('username', state.username || '')
        localStorage.setItem('email', state.email || '')
        localStorage.setItem('roles', JSON.stringify(state.roles))
      })
      .addCase(register.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer

