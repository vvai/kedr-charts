import React from 'react'
import { useDispatch } from 'react-redux'
import { Select } from 'antd'
import { setFilters, changeStatsMonth } from '../../features/charts/chartsSlice'
import './graphSettings.scss'

const { Option } = Select

export const GraphSettings = ({ filters, homeworks, months }) => {
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
        <Option value="students">Ученики</Option>
        <Option value="tasks">Задания</Option>
        <Option value="homeworks">Все домашки</Option>
      </Select>
      {filters.type !== 'homeworks' ? (
        <Select
          className="graph-settings__select"
          key="homework"
          value={filters.homework}
          onChange={(homework) =>
            dispatch(setFilters({ ...filters, homework }))
          }
        >
          {homeworks.map((h) => (
            <Option
              key={h.homeworkNumber}
              value={h.homeworkNumber}
            >{`Домашка ${h.homeworkNumber}`}</Option>
          ))}
          <Option value="all">Все задания</Option>
        </Select>
      ) : (
        <Select
          className="graph-settings__select"
          key="homeworkType"
          value={filters.homeworkGraphType}
          onChange={(type) =>
            dispatch(setFilters({ ...filters, homeworkGraphType: type }))
          }
        >
          <Option value="average">Правильных ответов в среднем</Option>
          <Option value="progress">Прогресс</Option>
        </Select>
      )}
    </div>
  )
}
