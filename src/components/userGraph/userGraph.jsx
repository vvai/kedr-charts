import React from 'react'
import { ProgressGraph } from './progressGraph'
import { RightAnswersGraph } from './rightAnswersGraph'

export const UserGraph = ({
  data,
  filters,
  homeworks,
  taskMetadata,
  months,
}) => {
  const Graph = filters?.type === 'progress' ? ProgressGraph : RightAnswersGraph

  if (Graph) {
    return (
      <Graph
        data={data}
        filters={filters}
        homeworks={homeworks}
        taskMetadata={taskMetadata}
        months={months}
      />
    )
  } else {
    return <div>Sorry, no info</div>
  }
}
