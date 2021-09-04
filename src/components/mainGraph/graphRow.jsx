import React from 'react'
import { mixTwoColors } from '../../utils/colorMixer'
import './graphRow.scss'

export const GraphRow = ({ data }) => {
  const color = mixTwoColors(data.persent)
  return (
    <div className="graph-row">
      <div className="graph-row__name">{data.name}</div>
      <div className="graph-row__stats" style={{ color }}>
        {data.right}/{data.total}
      </div>
      <div className="graph-row__bar-container">
        <div
          className="graph-row__bar"
          style={{
            backgroundColor: color,
            width: `${data.persent}%`,
          }}
        />
      </div>
    </div>
  )
}
