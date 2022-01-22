import { combineReducers } from 'redux'
import charts from './charts/chartsSlice'
import userStats from './userStats/userStatsSlice'

export const rootReducer = combineReducers({
  charts,
  userStats,
})
