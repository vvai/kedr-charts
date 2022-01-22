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
    getStatsByUserId: async (userId, month) => {
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
        return Object.values(result)
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
