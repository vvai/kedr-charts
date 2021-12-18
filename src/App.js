import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Layout } from 'antd'
import {
  selectFilters,
  selectRawGraphData,
  selectHomeworks,
  selectTaskMetadata,
  // setData,
  fetchChartsData,
  selectFireInstance,
  subscribeUpdates,
  unsubscribeUpdates,
} from './features/charts/chartsSlice'
import { GraphSettings, MainGraph } from './components'
import './App.scss'
// import mockData from './data/data.json'

const { Content } = Layout

function App() {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)
  const rawData = useSelector(selectRawGraphData)
  const homeworks = useSelector(selectHomeworks)
  const taskMetadata = useSelector(selectTaskMetadata)
  const fireInstance = useSelector(selectFireInstance)

  useEffect(() => {
    async function initialize() {
      await fireInstance.signIn()
      await dispatch(fetchChartsData())
      await dispatch(subscribeUpdates())
    }
    initialize()
    return () => {
      dispatch(unsubscribeUpdates())
    }
  }, [dispatch, fireInstance])

  return (
    <div className="App">
      <Content>
        <GraphSettings filters={filters} homeworks={homeworks} />
        <MainGraph
          filters={filters}
          data={rawData}
          homeworks={homeworks}
          taskMetadata={taskMetadata}
        />
        {/* <header className="App-header">
          <BasicChart data={data} />
          <p>Sample chart</p>
        </header> */}
      </Content>
    </div>
  )
}

export default App
