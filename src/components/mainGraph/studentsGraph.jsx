import React from 'react'
import { GraphRow } from '../graphRow/graphRow'

function prepareData(data, filters, homeworks) {
  const homework = homeworks.find((h) => h.homeworkNumber === filters.homework)
  const questionsNumber = homework ? homework.questionIdList.length : -1
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
    result.isRelevant =
      answers.length === questionsNumber || questionsNumber <= 0
    return result
  })
  preparedData.sort((a, b) => b.persent - a.persent)
  return preparedData
}

export const StudentsGraph = ({ data, filters, homeworks }) => {
  const preparedData = prepareData(data, filters, homeworks)
  const relevant = preparedData.filter((e) => e.isRelevant)
  const notRelevantYet = preparedData.filter((e) => !e.isRelevant)
  return (
    <>
      <div style={{ display: 'table', padding: '0 24px' }}>
        {relevant.map((data, index) => (
          <GraphRow key={data.id} index={index + 1} data={data} />
        ))}
      </div>
      {notRelevantYet.length ? (
        <div className="not-relevant-students">
          <span>Не сдали ({notRelevantYet.length}):</span>
          <br />
          {notRelevantYet.map((data) => (
            <span key={data.id} className="not-relevant-students__item">
              {data.name?.trim()}
              {', '}
            </span>
          ))}
        </div>
      ) : null}
    </>
  )
}
