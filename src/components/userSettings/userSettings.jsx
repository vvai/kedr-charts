import React from 'react'
import { useDispatch } from 'react-redux'
import { Select } from 'antd'
import {
  setFilters,
  changeStatsMonth,
} from '../../features/userStats/userStatsSlice'
import './userSettings.scss'

const { Option } = Select

export const UserSettings = ({ filters, months }) => {
  const dispatch = useDispatch()

  return (
    <div className="graph-settings">
      <Select
        className="graph-settings__select"
        key="month"
        value={filters.month}
        onChange={(month) => dispatch(changeStatsMonth(month))}
      >
        {months.map((m) => (
          <Option key={m.value} value={m.value}>
            {m.label}
          </Option>
        ))}
      </Select>
      <Select
        className="graph-settings__select"
        key="type"
        value={filters.type}
        onChange={(type) => dispatch(setFilters({ ...filters, type }))}
      >
        <Option value="answers">Правильных ответов</Option>
        <Option value="progress">Прогресс</Option>
      </Select>
    </div>
  )
}
