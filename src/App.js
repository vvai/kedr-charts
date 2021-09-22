import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Layout, Divider } from 'antd'
import {
  selectFilters,
  selectRawGraphData,
  selectHomeworks,
  selectTaskMetadata,
  // setData,
  fetchChartsData,
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
  // const [data] = useState([
  //   { genre: 'Sports', sold: 275 },
  //   { genre: 'Strategy', sold: 115 },
  //   { genre: 'Action', sold: 120 },
  //   { genre: 'Shooter', sold: 350 },
  //   { genre: 'Other', sold: 150 },
  // ])

  useEffect(() => {
    // dispatch(setData(mockData))
    dispatch(fetchChartsData())
  }, [dispatch])

  return (
    <div className="App">
      <Content>
        <GraphSettings filters={filters} homeworks={homeworks} />
        <Divider />
        <MainGraph
          filters={filters}
          data={rawData}
          homeworks={homeworks}
          taskMetadata={taskMetadata}
        />
        {/* <header className="App-header">
          <div className="charts">
            <div id="chart"></div>
          </div>
          <BasicChart data={data} />
          <p>Sample chart</p>
        </header> */}
      </Content>
    </div>
  )
}

export default App
