import React from 'react'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Layout, Spin, Space } from 'antd'
import {
  selectUserStatsLoadingStatus,
  fetchUserData,
  selectUserData,
  selectMonths,
  selectFilters,
} from '../features/userStats/userStatsSlice'
import { selectFireInstance } from '../features/charts/chartsSlice'
import { UserSettings } from '../components'
import './userPage.scss'

// user example - 854133937
const { Content } = Layout

function UsersPage() {
  let { id } = useParams()
  const dispatch = useDispatch()
  const user = useSelector(selectUserData)
  const fireInstance = useSelector(selectFireInstance)
  const loadingStatus = useSelector(selectUserStatsLoadingStatus)
  const months = useSelector(selectMonths)
  const filters = useSelector(selectFilters)
  useEffect(() => {
    async function initialize() {
      await fireInstance.signIn()
      await dispatch(fetchUserData(id))
    }
    initialize()
  }, [dispatch, fireInstance])
  return (
    <div className="Page">
      <Content>
        {/* <GraphSettings
          filters={filters}
          homeworks={homeworks}
          months={months}
        /> */}
        {loadingStatus !== 'loading' ? (
          user ? (
            <>
              <h1 className="user-page__title">{`${user.first_name || ''} ${
                user.last_name || ''
              }`}</h1>
              <UserSettings filters={filters} months={months} />
            </>
          ) : (
            <span>something is wrong with user id</span>
          )
        ) : (
          // <MainGraph
          //   filters={filters}
          //   data={rawData}
          //   homeworks={homeworks}
          //   taskMetadata={taskMetadata}
          //   months={months}
          // />
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

export default UsersPage
