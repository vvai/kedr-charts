import React from 'react'
import { GraphRow } from './graphRow'

function prepareData(data, filters, homeworks, taskMetadata, months) {
  const studentsCount = data.length
  if (filters.homeworkGraphType === 'average') {
    // Правильных ответов в среднем -- данные берутся только у сдавших: (число_правильных_ответов/всего_ответов)*100%
    return homeworks.map((h) => {
      const finishedStudents = data.filter((s) => {
        const studentQuestions = new Set(s.answers.map((a) => a.questionId))
        return h.questionIdList.every((question) =>
          studentQuestions.has(`${question}`)
        )
      })
      const questionsCount = h.questionIdList.length
      const questionsSet = new Set(h.questionIdList)
      const finishedStudentsRightAnswers = finishedStudents.map((student) => {
        return student.answers.filter((a) => {
          return (
            questionsSet.has(Number.parseInt(a.questionId)) && a.answer.isRight
          )
        }).length
      })
      const rightAnswersAverage =
        finishedStudentsRightAnswers.reduce((v, acc) => v + acc, 0) /
        finishedStudentsRightAnswers.length
      return {
        ...h,
        name: `${months.find((m) => m.value === filters.month)?.label} ${
          h.homeworkNumber
        }`,
        total: questionsCount,
        right: rightAnswersAverage,
        description: '',
        persent: rightAnswersAverage
          ? Math.floor((rightAnswersAverage * 100) / questionsCount)
          : 0,
      }
    })
  } else if (filters.homeworkGraphType === 'progress') {
    // Прогресс -- (число_сдавших/чило_всех_учеников)*100%
    return homeworks.map((h) => {
      const finishedStudentsCount = data.filter((s) => {
        const studentQuestions = new Set(s.answers.map((a) => a.questionId))
        return h.questionIdList.every((question) =>
          studentQuestions.has(`${question}`)
        )
      }).length
      return {
        ...h,
        name: `${months.find((m) => m.value === filters.month)?.label} ${
          h.homeworkNumber
        }`,
        total: studentsCount,
        right: finishedStudentsCount,
        description: '',
        persent: finishedStudentsCount
          ? Math.floor((finishedStudentsCount * 100) / studentsCount)
          : 0,
      }
    })
  } else {
    return []
  }
}

export const HomeworksGraph = ({
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
