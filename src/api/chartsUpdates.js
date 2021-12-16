import {
  collection,
  getDocs,
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
    getUsersStats: async () => {
      try {
        const result = {}
        const users = collection(db, 'users')
        const qUsers = query(users, orderBy('rus_dec'))
        const usersSnapshot = await getDocs(qUsers)
        usersSnapshot.forEach((doc) => {
          result[doc.id] = { ...doc.data(), id: doc.id, answers: [] }
        })

        const answers = collection(db, 'rus_dec_answers')
        const qAnswers = query(answers)
        // const qAnswers = query(answers, limit(30))
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
    subscribe: () => {
      const now = new Date()
      const dateOffset = 1000 * 60 // 60 sec overlap time.. just in case
      now.setTime(now.getTime() - dateOffset)
      // now.setMinutes(now.get)
      const answersRef = collection(db, 'rus_dec_answers')
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
