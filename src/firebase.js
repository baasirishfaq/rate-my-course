import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


//api key and config here
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };