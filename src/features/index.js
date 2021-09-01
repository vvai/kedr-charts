import { combineReducers } from 'redux'
import { charts } from './charts/chartsSlice'

export const rootReducer = combineReducers({
  charts,
})
