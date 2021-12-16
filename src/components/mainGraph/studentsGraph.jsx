import React from 'react'
import { GraphRow } from './graphRow'

function prepareData(data, filters, homeworks) {
  const homework = homeworks.find((h) => h.homeworkNumber === filters.homework)
  const questions = data
    .flatMap((student) => student.answers)
    .filter((elem) => {
      const question = Number.parseInt(elem.questionId)
      return !homework || homework.questionIdList.some((q) => q === question)
    })
    .map((el) => el.questionId)
  const total = new Set(questions).size
  let preparedData = data.map((student) => {
    const result = {
      name: `${student.first_name} ${student.last_name || ''}`,
      code: student.code,
      id: student.id,
    }
    const answers = student.answers.filter((answer) => {
      const question = Number.parseInt(answer.questionId)
      return !homework || homework.questionIdList.some((q) => q === question)
    })
    result.total = total
    result.right = answers.filter((a) => a.answer?.isRight).length
    result.persent = result.right
      ? Math.floor((result.right * 100) / result.total)
      : 0
    result.description = `${result.persent}%`
    return result
  })
  preparedData.sort((a, b) => b.persent - a.persent)
  return preparedData
}

export const StudentsGraph = ({ data, filters, homeworks }) => {
  const preparedData = prepareData(data, filters, homeworks)
  return (
    <div style={{ display: 'table', padding: '0 24px' }}>
      {preparedData.map((data, index) => (
        <GraphRow key={data.id} index={index + 1} data={data} />
      ))}
    </div>
  )
}
