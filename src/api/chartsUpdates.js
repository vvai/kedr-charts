import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  // limit,
  onSnapshot,
} from 'firebase/firestore'
import { signInAnonymously } from 'firebase/auth'
import db, { auth } from './firebase'

let unsubscribe, onUpdateCallback

async function getLastUserAnswers(userId, count, currentMonth) {
  const months = [
    'dec',
    'nov',
    'oct',
    // 'sep',
    // 'aug',
    // 'jul',
    // 'jun',
    // 'may',
    // 'apr',
    // 'mar',
    'feb',
    'jan',
  ]
  let maxCyclesCount = 4 // fail safe
  const result = []
  let currentMonthIndex = months.indexOf(currentMonth)
  try {
    while (result.length < count) {
      const month = months[currentMonthIndex % months.length]
      currentMonthIndex += 1
      const leftCount = count - result.length
      const answersCollection = collection(db, `rus_${month}_answers`)
      const qAnswers = query(
        answersCollection,
        where('__name__', '<=', `${userId}\uf8ff`),
        where('__name__', '>=', `${userId}`)
      )
      const answersSnapshot = await getDocs(qAnswers)
      let answers = answersSnapshot.docs.map((doc) => {
        const [_, questionId] = doc.id.split('_')
        return {
          id: doc.id,
          questionId: Number.parseInt(questionId),
          ...doc.data(),
        }
      })
      if (!answers?.length || maxCyclesCount-- < 0) {
        return result
      }
      answers.sort((a, b) => b.questionId - a.questionId)
      result.push(...answers.slice(0, leftCount))
    }
  } catch (e) {
    console.error(`get last user answers error ${e}`)
  }
  return result
}

const initialize = () => {
  return {
    signIn: async () => {
      return await signInAnonymously(auth)
    },
    getUsersStats: async (month) => {
      try {
        if (!month) {
          return {}
        }
        const result = {}
        const users = collection(db, 'users')
        const qUsers = query(users, orderBy(`rus_${month}`))
        const usersSnapshot = await getDocs(qUsers)
        usersSnapshot.forEach((userDoc) => {
          result[userDoc.id] = {
            ...userDoc.data(),
            id: userDoc.id,
            answers: [],
          }
        })

        const answers = collection(db, `rus_${month}_answers`)
        const qAnswers = query(answers)
        // const qAnswers = query(answers, limit(30))
        const answersSnapshot = await getDocs(qAnswers)
        answersSnapshot.forEach((answerDoc) => {
          const [userId, questionId] = answerDoc.id.split('_')
          if (result[userId]) {
            result[userId].answers.push({
              questionId: questionId,
              answer: {
                ...answerDoc.data(),
                createdAt: answerDoc.data().createdAt.seconds,
              },
            })
          }
        })
        return Object.values(result)
      } catch (e) {
        console.error('error ', e)
        return null
      }
    },
    getStatsByUserId: async (userId, month, currentMonth) => {
      try {
        if (!month || !userId) {
          return {}
        }
        const result = {}
        const user = await getDoc(doc(db, 'users', userId))

        if (!user.exists()) {
          console.log('user not exist')
          return null
        }
        result[user.id] = { ...user.data(), id: user.id, answers: [] }

        const answers = collection(db, `rus_${month}_answers`)
        const qAnswers = query(answers)
        const answersSnapshot = await getDocs(qAnswers)
        answersSnapshot.forEach((doc) => {
          const [userId, questionId] = doc.id.split('_')
          if (result[userId]) {
            result[userId].answers.push({
              questionId: questionId,
              answer: {
                ...doc.data(),
                createdAt: doc.data().createdAt.seconds,
              },
            })
          }
        })
        if (result[userId]) {
          const preparedUser = { ...result[userId], id: userId }
          preparedUser.lastAnswers = await getLastUserAnswers(
            userId,
            100,
            currentMonth
          )
          return preparedUser
        } else {
          return null
        }
      } catch (e) {
        console.error('error ', e)
        return null
      }
    },
    subscribe: (month) => {
      if (!month) {
        return
      }
      const now = new Date()
      const dateOffset = 1000 * 60 // 60 sec overlap time.. just in case
      now.setTime(now.getTime() - dateOffset)
      // now.setMinutes(now.get)
      const answersRef = collection(db, `rus_${month}_answers`)
      const answersQuery = query(answersRef, where('createdAt', '>=', now))
      unsubscribe = onSnapshot(answersQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (onUpdateCallback) {
            onUpdateCallback(change.doc.id, change.doc.data(), change.type)
          }
        })
      })
    },
    onUpdateCall: (callback) => {
      onUpdateCallback = callback
    },
    unsubscribe: () => {
      unsubscribe && unsubscribe()
    },
  }
}

export default initialize
