import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit'
import initFirebaseApi from '../../api/chartsUpdates'
import { getHomeworkData, getTaskMetadata, currentMonth } from '../../data'

const instance = initFirebaseApi()
const initialState = {
  code: '',
  status: 'idle',
  currentMonth,
  filters: {
    month: 'dec',
    homework: 'all',
    type: 'students', // students or tasks
  },
  rawData: [],
  months: [
    // { value: 'sept', label: 'Сентябрь' },
    { value: 'oct', label: 'Октябрь' },
    { value: 'nov', label: 'Ноябрь' },
    { value: 'dec', label: 'Декабрь' },
  ],
  homeworks: getHomeworkData(currentMonth),
  taskMetadata: getTaskMetadata(currentMonth),
  fireInstance: instance,
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(fetchCartsData(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchChartsData = createAsyncThunk(
  'charts/fetchData',
  async (_, { getState }) => {
    const state = getState()
    const instance = state.charts?.fireInstance
    // const response = await getChartsData(amount)
    const result = await instance.getUsersStats(state.charts.filters.month)
    // The value we return becomes the `fulfilled` action payload
    return result
  }
)

export const changeStatsMonth = createAsyncThunk(
  'charts/changeMonth',
  (month, { dispatch }) => {
    dispatch(updateMonthFilter(month))
    dispatch(fetchChartsData())
  }
)

export const subscribeUpdates = createAsyncThunk(
  'charts/subscribe',
  async (_, { getState, dispatch }) => {
    try {
      const instance = getState().charts?.fireInstance
      instance.onUpdateCall((id, data, type) => {
        if (type === 'added') {
          const [userId, questionId] = id?.split('_')
          dispatch(updateAnswersLive({ userId, questionId, data }))
        } else {
          console.log('XXX: action:', type)
        }
      })
      return instance.subscribe(getState().charts.currentMonth)
    } catch (e) {
      console.log(e)
    }
  }
)

export const unsubscribeUpdates = createAsyncThunk(
  'charts/unsubscribe',
  async (_, { getState }) => {
    try {
      const instance = getState().charts?.fireInstance
      instance.unsubscribe()
    } catch (e) {
      console.log(e)
    }
  }
)

export const updateRealTimeData = createAsyncThunk(
  'charts/updateRealtime',
  async (data) => {
    return data
  }
)

const updateAnswersLive = createAction('charts/updateAnswersLive')
const updateMonthFilter = createAction('charts/updateMonthFilter')

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
    updateMonthFilter: (state, action) => {
      const newMonth = action.payload
      state.filters.month = newMonth
      state.homeworks = getHomeworkData(newMonth)
      state.taskMetadata = getTaskMetadata(newMonth)
    },
    updateAnswersLive: (state, action) => {
      const isCurrentMonthSelected = state.currentMonth === state.filters.month
      if (isCurrentMonthSelected) {
        let newData = state.rawData.map((user) => {
          if (user.id !== action.payload.userId) {
            return user
          } else {
            const isAlreadyAdded = user.answers.some(
              (a) => a.questionId === action.payload.questionId
            )
            console.log(
              'XXX: add answer',
              `${user.first_name} ${user.last_name}`,
              action.payload.data,
              isAlreadyAdded
            )
            return {
              ...user,
              answers: isAlreadyAdded
                ? user.answers
                : [
                    ...user.answers,
                    {
                      questionId: action.payload.questionId,
                      answer: action.payload.data,
                    },
                  ],
            }
          }
        })
        state.rawData = newData
      } else {
        console.log(`skip update: month is ${state.filters.month}`)
      }
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchChartsData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchChartsData.fulfilled, (state, action) => {
        state.status = 'idle'
        state.rawData = action.payload
      })
      .addCase(updateRealTimeData.fulfilled, (state, { payload }) => {
        let newData = state.rawData.map((user) => {
          if (user.id !== payload.userId) {
            return user
          } else {
            return {
              ...user,
              answers: [
                ...user.answers,
                {
                  questionId: payload.questionId,
                  answer: payload.data,
                },
              ],
            }
          }
        })

        state.rawData = newData
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
export const selectHomeworks = (state) => state.charts.homeworks
export const selectTaskMetadata = (state) => state.charts.taskMetadata
export const selectFireInstance = (state) => state.charts.fireInstance
export const selectMonths = (state) => state.charts.months
export const selectChartLoadingStatus = (state) => state.charts.status

export default chartSlice.reducer
