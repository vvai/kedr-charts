import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit'
import { getHomeworkData, getTaskMetadata, currentMonth } from '../../data'

const initialState = {
  id: null,
  status: 'idle',
  currentMonth,
  filters: {
    month: currentMonth,
    type: 'answers',
  },
  rawData: null,
  months: [
    // { value: 'sept', label: 'Сентябрь' },
    { value: 'oct', label: 'Октябрь' },
    { value: 'nov', label: 'Ноябрь' },
    { value: 'dec', label: 'Декабрь' },
    { value: 'jan', label: 'Январь' },
    { value: 'feb', label: 'Февраль' },
  ],
  homeworks: getHomeworkData(currentMonth),
  taskMetadata: getTaskMetadata(currentMonth),
}

export const fetchUserData = createAsyncThunk(
  'userStats/fetchData',
  async (userId, { getState }) => {
    const state = getState()
    if (!userId) {
      return null
    }
    const instance = state.charts?.fireInstance
    const result = await instance.getStatsByUserId(
      userId,
      state.userStats.filters.month
    )
    console.log('user ', result, userId)
    // The value we return becomes the `fulfilled` action payload
    return result && result.length ? { ...result[0], id: userId } : null
  }
)

export const changeStatsMonth = createAsyncThunk(
  'userStats/changeMonth',
  (month, { dispatch, getState }) => {
    dispatch(updateMonthFilter(month))
    dispatch(fetchUserData(getState().userStats?.rawData?.id))
  }
)

const updateMonthFilter = createAction('userStats/updateMonthFilter')

export const userStatsSlice = createSlice({
  name: 'userStats',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUserId: (state, action) => {
      state.id = action.payload
    },
    setFilters: (state, action) => {
      state.filters = action.payload
    },
    updateMonthFilter: (state, action) => {
      const newMonth = action.payload
      state.filters.month = newMonth
      state.homeworks = getHomeworkData(newMonth)
      state.taskMetadata = getTaskMetadata(newMonth)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'idle'
        state.rawData = action.payload
      })
  },
})

export const { setCode, setFilters, setData } = userStatsSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.charts.value)`
export const selectUserStatsLoadingStatus = (state) => state.userStats.status
export const selectUserData = (state) => state.userStats.rawData
export const selectFilters = (state) => state.userStats.filters
export const selectMonths = (state) => state.userStats.months
export const selectHomeworks = (state) => state.charts.homeworks
export const selectTaskMetadata = (state) => state.charts.taskMetadata

export default userStatsSlice.reducer
