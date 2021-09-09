import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getChartsData } from '../../api/chartsApi'

const initialState = {
  code: '',
  status: 'idle',
  filters: {
    type: 'students', // students or tasks
    min: 1,
    max: 10,
    sort_by: 'tasks', // tasks or complexity
  },
  rawData: [],
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(fetchCartsData(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchCartsData = createAsyncThunk(
  'charts/fetchData',
  async (amount) => {
    const response = await getChartsData(amount)
    // The value we return becomes the `fulfilled` action payload
    return response.data
  }
)

export const chartSlice = createSlice({
  name: 'charts',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setCode: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.code = action.payload
    },
    setData: (state, action) => {
      state.rawData = action.payload
    },
    setFilters: (state, action) => {
      state.filters = action.payload
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartsData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCartsData.fulfilled, (state, action) => {
        state.status = 'idle'
        state.rawData = action.payload
      })
  },
})

export const { setCode, setFilters, setData } = chartSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.charts.value)`
export const selectCode = (state) => state.charts.code
export const selectFilters = (state) => state.charts.filters
export const selectRawGraphData = (state) => state.charts.rawData

export default chartSlice.reducer