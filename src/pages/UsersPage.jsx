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
  selectHomeworks,
  selectTaskMetadata,
} from '../features/userStats/userStatsSlice'
import { selectFireInstance } from '../features/charts/chartsSlice'
import { UserSettings, UserGraph, UserEstimation } from '../components'
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
  const homeworks = useSelector(selectHomeworks)
  const taskMetadata = useSelector(selectTaskMetadata)
  useEffect(() => {
    async function initialize() {
      await fireInstance.signIn()
      await dispatch(fetchUserData(id))
    }
    initialize()
  }, [dispatch, fireInstance])
  const shouldShowLoading = loadingStatus === 'loading' && !user
  const graphLoading = loadingStatus === 'loading'
  return (
    <div className="Page">
      <Content>
        {!shouldShowLoading ? (
          user ? (
            <>
              <h1 className="user-page__title">{`${user.first_name || ''} ${
                user.last_name || ''
              }`}</h1>
              <UserEstimation user={user} />
              <UserSettings filters={filters} months={months} />
              {graphLoading ? (
                <Space size="large">
                  <Spin
                    className="user-page__loading"
                    tip="Loading..."
                    size="large"
                  />
                </Space>
              ) : (
                <UserGraph
                  filters={filters}
                  data={user}
                  homeworks={homeworks}
                  taskMetadata={taskMetadata}
                  months={months}
                />
              )}
            </>
          ) : (
            <h1>something is wrong with user id</h1>
          )
        ) : (
          <Space size="large">
            <Spin
              className="user-page__loading"
              tip="Loading..."
              size="large"
            />
          </Space>
        )}
      </Content>
    </div>
  )
}

export default UsersPage
