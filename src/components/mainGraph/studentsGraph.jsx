import React from 'react'
import { GraphRow } from './graphRow'

export const StudentsGraph = ({ data, filters }) => {
  let preparedData = data.map((student) => {
    const result = {
      name: `${student.first_name} ${student.last_name || ''}`,
      code: student.code,
    }
    const answers = student.answers.filter((answer) => {
      const question = Number.parseInt(answer.questionId)
      return question <= filters.max && question >= filters.min
    })
    result.total = answers.length
    result.right = answers.filter((a) => a.answer?.isRight).length
    result.persent = result.right
      ? Math.floor((result.right * 100) / result.total)
      : 0
    return result
  })
  // preparedData.sort((a, b) => b.right - a.right)
  preparedData.sort((a, b) => b.persent - a.persent)
  return (
    <div style={{ display: 'table', padding: '0 24px' }}>
      {preparedData.map((data) => (
        <GraphRow key={data.code || data.name} data={data} />
      ))}
    </div>
  )
}
