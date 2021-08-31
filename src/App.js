import React, { useState, useEffect } from 'react';
import { Chart } from '@antv/g2';
// import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState([
    { genre: 'Sports', sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action', sold: 120 },
    { genre: 'Shooter', sold: 350 },
    { genre: 'Other', sold: 150 },
  ]);

  useEffect(() => {
    const chart = new Chart({
      container: 'chart',
      width: 600,
      height: 300,
    });
    chart.data(data);
    chart.interval().position('genre*sold');
    chart.render();
  });

  return (
    <div className="App">
      <header className="App-header">
        <div className="charts">
          <div id="chart"></div>
        </div>
        <p>Sample chart</p>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

export default App;
