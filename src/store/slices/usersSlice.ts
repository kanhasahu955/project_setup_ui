import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { User } from '@/api/users'
import { fetchUsers as fetchUsersApi } from '@/api/users'

export interface UsersState {
  items: User[]
  isLoading: boolean
  error?: string
}

const initialState: UsersState = {
  items: [],
  isLoading: false,
}

export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetchUsers',
  async () => {
    const data = await fetchUsersApi()
    return data
  },
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to load users'
      })
  },
})

export const usersReducer = usersSlice.reducer

