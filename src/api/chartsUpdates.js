import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore'
import { signInAnonymously } from 'firebase/auth'
import { updateRealTimeData } from '../features/charts/chartsSlice'
import db, { auth } from './firebase'

const signIn = async () => {
  return await signInAnonymously(auth)
}

// export const getUsersStats = async () => {
//   try {
//     await signIn()
//     const result = {}
//     const users = collection(db, 'users')
//     const qUsers = query(users, orderBy('rus_nov'))
//     const usersSnapshot = await getDocs(qUsers)
//     usersSnapshot.forEach((doc) => {
//       result[doc.id] = { ...doc.data(), answers: [] }
//     })

//     const answers = collection(db, 'rus_nov_answers')
//     const qAnswers = query(answers)
//     const answersSnapshot = await getDocs(qAnswers)
//     answersSnapshot.forEach((doc) => {
//       const [userId, questionId] = doc.id.split('_')
//       // console.log('answer', doc.id, userId, questionId, ' => ', doc.data())
//       if (result[userId]) {
//         // console.log('user found in result!')
//         result[userId].answers.push({
//           questionId: questionId,
//           answer: {
//             ...doc.data(),
//             createdAt: doc.data().createdAt.seconds,
//           },
//         })
//       }
//       // result.push({ id: doc.id, ...doc.data() })
//     })
//     const unsubscribe = onSnapshot(query(answers), (snapshot) => {
//       snapshot.docChanges().forEach((change) => {
//         console.log(
//           'doc change!!! ',
//           change.type,
//           change.doc.id,
//           change.doc.data()
//         )
//         const [userId, questionId] = change.doc.id.split('_')
//         updateRealTimeData(change.doc)
//       })
//     })
//     console.log('docs ', result)
//     return Object.values(result)
//   } catch (e) {
//     console.error('error ', e)
//     return null
//   }
// }
let unsubscribe
let instance

const initialize = async () => {
  console.log('initialize!1!')
  await signIn()
  return {
    getUsersStats: async () => {
      try {
        const result = {}
        const users = collection(db, 'users')
        const qUsers = query(users, orderBy('rus_nov'))
        const usersSnapshot = await getDocs(qUsers)
        usersSnapshot.forEach((doc) => {
          result[doc.id] = { ...doc.data(), answers: [] }
        })

        const answers = collection(db, 'rus_nov_answers')
        const qAnswers = query(answers)
        const answersSnapshot = await getDocs(qAnswers)
        answersSnapshot.forEach((doc) => {
          const [userId, questionId] = doc.id.split('_')
          // console.log('answer', doc.id, userId, questionId, ' => ', doc.data())
          if (result[userId]) {
            // console.log('user found in result!')
            result[userId].answers.push({
              questionId: questionId,
              answer: {
                ...doc.data(),
                createdAt: doc.data().createdAt.seconds,
              },
            })
          }
          // result.push({ id: doc.id, ...doc.data() })
        })

        console.log('docs ', result)
        return Object.values(result)
      } catch (e) {
        console.error('error ', e)
        return null
      }
    },
    subscribe: () => {
      const answers = collection(db, 'rus_nov_answers')
      unsubscribe = onSnapshot(query(answers), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          console.log(
            'doc change!!! ',
            change.type,
            change.doc.id,
            change.doc.data()
          )
          const [userId, questionId] = change.doc.id.split('_')
          updateRealTimeData(change.doc)
        })
      })
    },
    destroy: unsubscribe,
  }
}

export default initialize
