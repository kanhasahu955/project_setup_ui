import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { get } from '@/api/httpClient'

export interface ExampleItem {
  id: string
  name: string
}

export interface ExampleState {
  items: ExampleItem[]
  isLoading: boolean
  error?: string
}

const initialState: ExampleState = {
  items: [],
  isLoading: false,
}

export const fetchExampleItems = createAsyncThunk<ExampleItem[]>(
  'example/fetchItems',
  async () => {
    // Replace '/items' with your real endpoint
    const data = await get<ExampleItem[]>('/items')
    return data
  },
)

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<ExampleItem>) {
      state.items.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExampleItems.pending, (state) => {
        state.isLoading = true
        state.error = undefined
      })
      .addCase(fetchExampleItems.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchExampleItems.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? 'Failed to load items'
      })
  },
})

export const { addItem } = exampleSlice.actions

export const exampleReducer = exampleSlice.reducer

