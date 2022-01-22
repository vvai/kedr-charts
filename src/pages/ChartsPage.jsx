import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Layout, Spin, Space } from 'antd'
import {
  selectFilters,
  selectRawGraphData,
  selectHomeworks,
  selectTaskMetadata,
  selectMonths,
  // setData,
  fetchChartsData,
  selectFireInstance,
  subscribeUpdates,
  unsubscribeUpdates,
  selectChartLoadingStatus,
} from '../features/charts/chartsSlice'
import { GraphSettings, MainGraph } from '../components'
// import mockData from './data/data.json'

const { Content } = Layout

function ChartsPage() {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)
  const rawData = useSelector(selectRawGraphData)
  const homeworks = useSelector(selectHomeworks)
  const taskMetadata = useSelector(selectTaskMetadata)
  const fireInstance = useSelector(selectFireInstance)
  const months = useSelector(selectMonths)
  const loadingStatus = useSelector(selectChartLoadingStatus)

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
    <div className="Page">
      <Content>
        <GraphSettings
          filters={filters}
          homeworks={homeworks}
          months={months}
        />
        {loadingStatus !== 'loading' ? (
          <MainGraph
            filters={filters}
            data={rawData}
            homeworks={homeworks}
            taskMetadata={taskMetadata}
            months={months}
          />
        ) : (
          <Space size="large">
            <Spin tip="Loading..." size="large" />
          </Space>
        )}
        {/* <header className="App-header">
          <BasicChart data={data} />
          <p>Sample chart</p>
        </header> */}
      </Content>
    </div>
  )
}

export default ChartsPage
