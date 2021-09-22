import React from 'react'
import { StudentsGraph } from './studentsGraph'
import { TasksGraph } from './tasksGraph'

export const MainGraph = ({ data, filters, homeworks, taskMetadata }) => {
  if (filters?.type === 'students') {
    return (
      <StudentsGraph
        data={data}
        filters={filters}
        homeworks={homeworks}
        taskMetadata={taskMetadata}
      />
    )
  } else if (filters?.type === 'tasks') {
    return (
      <TasksGraph
        data={data}
        filters={filters}
        homeworks={homeworks}
        taskMetadata={taskMetadata}
      />
    )
  } else {
    return <div>Sorry, no info</div>
  }
}
