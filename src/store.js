import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './features'
// import chartsReducer from './features/charts/chartsSlice'

export const store = configureStore({
  // reducer: {
  //   charts: chartsReducer,
  // },
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
