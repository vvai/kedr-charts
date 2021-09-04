import React from 'react'
import { useDispatch } from 'react-redux'
import { Select, Form, Input } from 'antd'
import { setFilters } from '../../features/charts/chartsSlice'
import './graphSettings.scss'

const { Option } = Select

export const GraphSettings = ({ filters }) => {
  const dispatch = useDispatch()

  return (
    <div className="graph-settings">
      <Form.Item>
        <Select
          value={filters.type}
          style={{ width: 320 }}
          onChange={(type) => dispatch(setFilters({ ...filters, type }))}
        >
          <Option value="students">Ученики: % правильных ответов</Option>
          <Option value="tasks">Задания: % правильных ответов</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Диапазон заданий">
        <Input
          style={{ width: 70, marginRight: 20 }}
          onChange={(e) =>
            dispatch(setFilters({ ...filters, min: e.target.value }))
          }
          type="number"
          value={filters.min}
        />
        <Input
          style={{ width: 70 }}
          type="number"
          value={filters.max}
          onChange={(e) =>
            dispatch(setFilters({ ...filters, max: e.target.value }))
          }
        />
      </Form.Item>
      {filters.type === 'tasks' && (
        <Form.Item>
          <Select
            value={filters.sort_by}
            style={{ width: 220 }}
            onChange={(sort_by) =>
              dispatch(setFilters({ ...filters, sort_by }))
            }
          >
            <Option value="tasks">Сортировка по заданиям</Option>
            <Option value="complexity">Сортировка по сложности</Option>
          </Select>
        </Form.Item>
      )}
    </div>
  )
}
