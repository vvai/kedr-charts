import React from 'react'
import { GraphRow } from '../graphRow/graphRow'

function prepareData(data, filters, homeworks, taskMetadata, months) {
  return homeworks.map((h) => {
    const questionsCount = h.questionIdList.length
    const answeredQuestionCount = data.answers.filter((a) =>
      h.questionIdList.includes(Number.parseInt(a.questionId))
    ).length
    return {
      ...h,
      name: `${months.find((m) => m.value === filters.month)?.label} ${
        h.homeworkNumber
      }`,
      total: questionsCount,
      right: answeredQuestionCount,
      description: '',
      persent: answeredQuestionCount
        ? Math.floor((answeredQuestionCount * 100) / questionsCount)
        : 0,
    }
  })
}

export const ProgressGraph = ({
  data,
  filters,
  homeworks,
  taskMetadata,
  months,
}) => {
  const preparedData = prepareData(
    data,
    filters,
    homeworks,
    taskMetadata,
    months
  )
  return (
    <div style={{ display: 'table', padding: '0 24px' }}>
      {preparedData.map((data) => (
        <GraphRow key={data.name} data={data} />
      ))}
    </div>
  )
}
