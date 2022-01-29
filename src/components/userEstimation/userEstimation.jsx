import React from 'react'
import './userEstimation.scss'

function getEstimation(user) {
  if (!user?.lastAnswers?.length) {
    return 0
  }
  const countOfAnswers = user.lastAnswers.length
  const rightAnswers = user.lastAnswers.filter((a) => a.isRight).length
  return Math.round((rightAnswers / countOfAnswers) * 100)
}

export const UserEstimation = ({ user }) => {
  const estimation = getEstimation(user)
  if (!estimation) return null
  return (
    <div className="user-estimation">
      <div className="user-estimation__number">{estimation}</div>
      <div className="user-estimation__description">Баллов на ЦТ</div>
    </div>
  )
}
