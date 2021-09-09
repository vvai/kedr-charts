import React from 'react'
import { GraphRow } from './graphRow'

function prepareData(data, filters) {
  let graphData = {}
  data
    .flatMap((student) => student.answers)
    .filter((elem) => {
      const question = Number.parseInt(elem.questionId)
      return question <= filters.max && question >= filters.min
    })
    .forEach((elem) => {
      const question = graphData[elem.questionId]
      if (question) {
        question.total += 1
        question.right += elem.answer.isRight ? 1 : 0
      } else {
        graphData[elem.questionId] = {
          total: 1,
          right: elem.answer.isRight ? 1 : 0,
        }
      }
    })
  const preparedData = Object.keys(graphData).map((question) => {
    const d = graphData[question]
    return {
      name: question,
      total: d.total,
      right: d.right,
      description: `${d.right ? Math.floor((d.right * 100) / d.total) : 0}%`,
      persent: d.right ? Math.floor((d.right * 100) / d.total) : 0,
    }
  })
  if (filters.sort_by === 'complexity') {
    preparedData.sort(
      (a, b) => Number.parseInt(a.persent) - Number.parseInt(b.persent)
    )
  } else {
    preparedData.sort((a, b) => a.name - b.name)
  }
  return preparedData
}

export const TasksGraph = ({ data, filters }) => {
  const preparedData = prepareData(data, filters)
  return (
    <div style={{ display: 'table', padding: '0 24px' }}>
      {preparedData.map((data) => (
        <GraphRow key={data.name} data={data} />
      ))}
    </div>
  )
}