import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const config = {
  apiKey: "AIzaSyAUALVOgWyufbrRpLzrZoTuce8z9M5_BPs",
  authDomain: "trapppcloud.firebaseapp.com",
  projectId: "trapppcloud",
  storageBucket: "trapppcloud.appspot.com",
  messagingSenderId: "674490596107",
  appId: "1:674490596107:web:5ae0d05e1c49760df6400e"
};

export const app = initializeApp(config)
export const firestore = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app,"trapppcloud.appspot.com")
