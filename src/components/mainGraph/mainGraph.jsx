import React, { useRef, useEffect } from 'react'
import { StudentsGraph } from './studentsGraph'
import { TasksGraph } from './tasksGraph'

export const MainGraph = ({ data, filters }) => {
  if (filters?.type === 'students') {
    return <StudentsGraph data={data} filters={filters} />
  } else if (filters?.type === 'tasks') {
    return <TasksGraph data={data} filters={filters} />
  } else {
    return <div>Sorry, no info</div>
  }
}
