import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  // selectCode,
  fetchCartsData,
} from './features/charts/chartsSlice'
import { BasicChart } from './components/basicChart'
import './App.css'

function App() {
  const all = useSelector((state) => state)
  console.log('all ', all)
  const dispatch = useDispatch()
  const [data] = useState([
    { genre: 'Sports', sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action', sold: 120 },
    { genre: 'Shooter', sold: 350 },
    { genre: 'Other', sold: 150 },
  ])

  useEffect(() => {
    dispatch(fetchCartsData())
  }, [dispatch])

  return (
    <div className="App">
      <header className="App-header">
        <div className="charts">
          {/* <div  onClick={() => dispatch(increment())}>test {count}</div> */}
          <div id="chart"></div>
        </div>
        <BasicChart data={data} />
        <p>Sample chart</p>
      </header>
    </div>
  )
}

export default App
