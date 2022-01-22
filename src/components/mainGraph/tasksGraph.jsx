import React from 'react'
import { GraphRow } from '../graphRow/graphRow'

function prepareData(data, filters, homeworks, taskMetadata) {
  const homework = homeworks.find((h) => h.homeworkNumber === filters.homework)
  let graphData = {}
  data
    .flatMap((student) => student.answers)
    .filter((elem) => {
      const question = Number.parseInt(elem.questionId)
      return !homework || homework.questionIdList.some((q) => q === question)
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
  let preparedData = Object.keys(graphData).map((question) => {
    const d = graphData[question]
    const name = taskMetadata[question] || question
    return {
      name: name.toUpperCase(),
      total: d.total,
      right: d.right,
      description: question,
      persent: d.right ? Math.floor((d.right * 100) / d.total) : 0,
    }
  })
  // add relative number in homework
  preparedData.sort((a, b) => a.name - b.name)
  preparedData = preparedData.map((row, index) => ({
    ...row,
    description: index + 1,
  }))
  preparedData.sort(
    (a, b) => Number.parseInt(a.persent) - Number.parseInt(b.persent)
  )

  return preparedData
}

export const TasksGraph = ({ data, filters, homeworks, taskMetadata }) => {
  const preparedData = prepareData(data, filters, homeworks, taskMetadata)
  return (
    <div style={{ display: 'table', padding: '0 24px' }}>
      {preparedData.map((data) => (
        <GraphRow key={data.description} data={data} />
      ))}
    </div>
  )
}
