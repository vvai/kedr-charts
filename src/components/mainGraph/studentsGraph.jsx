import React from 'react'
import { GraphRow } from './graphRow'

function prepareData(data, filters) {
  const questions = data
    .flatMap((student) => student.answers)
    .filter((elem) => {
      const question = Number.parseInt(elem.questionId)
      return question <= filters.max && question >= filters.min
    })
    .map((el) => el.questionId)
  const total = new Set(questions).size
  let preparedData = data.map((student) => {
    const result = {
      name: `${student.first_name} ${student.last_name || ''}`,
      code: student.code,
    }
    const answers = student.answers.filter((answer) => {
      const question = Number.parseInt(answer.questionId)
      return question <= filters.max && question >= filters.min
    })
    result.total = total
    result.right = answers.filter((a) => a.answer?.isRight).length
    result.persent = result.right
      ? Math.floor((result.right * 100) / result.total)
      : 0
    result.description = `${result.right}/${result.total}`
    return result
  })
  preparedData.sort((a, b) => b.persent - a.persent)
  return preparedData
}

export const StudentsGraph = ({ data, filters }) => {
  const preparedData = prepareData(data, filters)
  return (
    <div style={{ display: 'table', padding: '0 24px' }}>
      {preparedData.map((data) => (
        <GraphRow key={data.code || data.name} data={data} />
      ))}
    </div>
  )
}
