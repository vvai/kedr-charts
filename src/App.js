import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'
import ChartsPage from './pages/ChartsPage'
import UsersPage from './pages/UsersPage'
import './App.scss'

function App() {
  return (
    <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Charts</Link>
            </li>
            <li>
              <Link to="/user">User</Link>
            </li>
          </ul>
        </nav> */}

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/users/:id" element={<UsersPage />} />
          <Route path="/" element={<ChartsPage />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </div>
    </Router>
  )
}

function NoMatch() {
  let location = useLocation()

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  )
}

export default App
