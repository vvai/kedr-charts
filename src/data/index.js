// sep
// import sepHomeworkData from './tasks_to_homeworks_sep.json'
// import sepTaskMetadata from './task_to_level_flat_sep.json'
// oct
import octHomeworkData from './tasks_to_homeworks_oct.json'
import octTaskMetadata from './task_to_level_flat_oct.json'
// nov
import novHomeworkData from './tasks_to_homeworks_nov.json'
import novTaskMetadata from './task_to_level_flat_nov.json'
// dec
import decHomeworkData from './tasks_to_homeworks_dec.json'
import decTaskMetadata from './task_to_level_flat_dec.json'

export const homeworkData = {
  // sept: sepHomeworkData,
  oct: octHomeworkData,
  nov: novHomeworkData,
  dec: decHomeworkData,
}

export const taskMetadata = {
  // sept: sepTaskMetadata,
  oct: octTaskMetadata,
  nov: novTaskMetadata,
  dec: decTaskMetadata,
}

export const getHomeworkData = (month) => homeworkData[month]
export const getTaskMetadata = (month) => taskMetadata[month]
export const currentMonth = 'dec'
