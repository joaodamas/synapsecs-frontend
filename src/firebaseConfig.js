import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDJ3_5NPmh96UUtJhUfCpmjK74ut9b3e4Q',
  authDomain: 'synapse-cs.firebaseapp.com',
  projectId: 'synapse-cs',
  storageBucket: 'synapse-cs.firebasestorage.app',
  messagingSenderId: '847687663798',
  appId: '1:847687663798:web:cb7e6305a2301fcb8de617',
  measurementId: 'G-G457C2W89Q'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export let analytics = null;

if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported && firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      analytics = null;
    });
}
