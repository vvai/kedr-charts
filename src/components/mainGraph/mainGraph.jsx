import React from 'react'
import { StudentsGraph } from './studentsGraph'
import { TasksGraph } from './tasksGraph'
import { HomeworksGraph } from './homeworksGraph'
import './mainGraph.scss'

export const MainGraph = ({
  data,
  filters,
  homeworks,
  taskMetadata,
  months,
}) => {
  let Graph
  if (filters?.type === 'students') {
    Graph = StudentsGraph
  } else if (filters?.type === 'tasks') {
    Graph = TasksGraph
  } else if (filters?.type === 'homeworks') {
    Graph = HomeworksGraph
  }

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
