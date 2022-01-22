import React from 'react'
import { mixTwoColors } from '../../utils/colorMixer'
import './graphRow.scss'

export const GraphRow = ({ data, index }) => {
  const color = mixTwoColors(data.persent)
  const showIndex = index || data.description
  return (
    <div className="graph-row">
      <div className="graph-row__bar-container">
        <div
          className="graph-row__persent"
          style={{ color: data.persent <= 5 ? 'black' : 'white' }}
        >{`${data.persent}%`}</div>
        <div
          className="graph-row__bar"
          style={{
            backgroundColor: color,
            width: `${data.persent}%`,
          }}
        />
      </div>
      <div className="graph-row__index">
        {showIndex ? `${index || data.description}.` : ''}
      </div>
      <div className="graph-row__name">{data.name}</div>
    </div>
  )
}
