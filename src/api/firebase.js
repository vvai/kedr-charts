// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
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
  apiKey: "AIzaSyCeCTBpBY0QINmSHyWVFzSwYy8qmNry2WQ",
  authDomain: "kedrbots-5fee0.firebaseapp.com",
  projectId: "kedrbots-5fee0",
  storageBucket: "kedrbots-5fee0.appspot.com",
  messagingSenderId: "801189597219",
  appId: "1:801189597219:web:8a241cf4a2050cca04e196",
  measurementId: "G-RW8YXW5BS0"
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

export const auth = getAuth(firebaseApp)
export const analytics = getAnalytics(firebaseApp)

export default db
