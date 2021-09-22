import React from 'react'
import { useDispatch } from 'react-redux'
import { Select, Form } from 'antd'
import { setFilters } from '../../features/charts/chartsSlice'
import './graphSettings.scss'

const { Option } = Select

export const GraphSettings = ({ filters, homeworks }) => {
  const dispatch = useDispatch()

  return (
    <div className="graph-settings">
      <Form.Item>
        <Select
          key="homework"
          value={filters.homework}
          style={{ width: 160, marginRight: 20 }}
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
        <Select
          key="type"
          value={filters.type}
          style={{ width: 160 }}
          onChange={(type) => dispatch(setFilters({ ...filters, type }))}
        >
          <Option value="students">Ученики</Option>
          <Option value="tasks">Задания</Option>
        </Select>
      </Form.Item>
    </div>
  )
}
