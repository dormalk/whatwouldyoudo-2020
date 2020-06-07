import * as firebase from 'firebase';

export const firebaseConfig = {
    apiKey: "AIzaSyB8L1Gj9mQxOFN8ueuNFInTUX2kI6LZ1gE",
    authDomain: "whatwouldyoudo-fe849.firebaseapp.com",
    databaseURL: "https://whatwouldyoudo-fe849.firebaseio.com",
    projectId: "whatwouldyoudo-fe849",
    storageBucket: "whatwouldyoudo-fe849.appspot.com",
    messagingSenderId: "586683107876",
    appId: "1:586683107876:web:c5da27b908a2bda97926b1"
};

const initializedFirebaseApp = firebase.initializeApp(firebaseConfig)

export {initializedFirebaseApp}