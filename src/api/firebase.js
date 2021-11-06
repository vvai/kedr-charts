// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'
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
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyBJLO7Mvsyv3DZrs9LtHDcEHb6pJCt87Jg',
//   authDomain: 'kedrbots-5fee0.firebaseapp.com',
//   projectId: 'kedrbots-5fee0',
//   storageBucket: 'kedrbots-5fee0.appspot.com',
//   messagingSenderId: '801189597219',
//   appId: '1:801189597219:web:9b7626eb7dcda3f704e196',
// }
const firebaseConfig = {
  apiKey: 'AIzaSyCeCTBpBY0QINmSHyWVFzSwYy8qmNry2WQ',
  authDomain: 'kedrbots-5fee0.firebaseapp.com',
  projectId: 'kedrbots-5fee0',
  storageBucket: 'kedrbots-5fee0.appspot.com',
  messagingSenderId: '801189597219',
  appId: '1:801189597219:web:8a241cf4a2050cca04e196',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

const auth = getAuth(firebaseApp)
// onAuthStateChanged(auth, (user) => {
//   if (user !== null) {
//     console.log('logged in!')
//   } else {
//     console.log('No user')
//   }
// })

export const signIn = async () => {
  return await signInAnonymously(auth)
}

export const getUsersStats = async () => {
  try {
    await signIn()
    const result = {}
    const users = collection(db, 'users')
    const qUsers = query(users, orderBy('rus_nov'))
    const usersSnapshot = await getDocs(qUsers)
    usersSnapshot.forEach((doc) => {
      result[doc.id] = { ...doc.data(), answers: [] }
    })

    const answers = collection(db, 'rus_nov_answers')
    const qAnswers = query(answers, limit(1300))
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
    // const unsubscribe = onSnapshot(query(answers), (snapshot) => {
    //   snapshot.docChanges().forEach((change) => {
    //     console.log(
    //       'doc change!!! ',
    //       change.type,
    //       change.doc.id,
    //       change.doc.data()
    //     )
    //     const [userId, questionId] = change.doc.id.split('_')
    //   })
    // })
    // console.log('docs ', result)
    return Object.values(result)
  } catch (e) {
    console.error('error ', e)
    return null
  }
}
