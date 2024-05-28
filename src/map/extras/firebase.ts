import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDvAifAak_1FamxoT_BlOv6NjsvV3w4OOs",
    authDomain: "wifimap-98c39.firebaseapp.com",
    projectId: "wifimap-98c39",
    storageBucket: "wifimap-98c39.appspot.com",
    messagingSenderId: "14483793510",
    appId: "1:14483793510:web:ca07f5d0e5464a897aefa7",
    measurementId: "G-PP2W9MZC4Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs };