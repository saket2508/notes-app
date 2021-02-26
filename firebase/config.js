import * as firebase from 'firebase';
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA-qbt2kOmnkDWR5mw8687H8Nz17G76Z7k",
    authDomain: "notes-app-933c8.firebaseapp.com",
    databaseURL: "https://notes-app-933c8-default-rtdb.firebaseio.com",
    projectId: "notes-app-933c8",
    storageBucket: "notes-app-933c8.appspot.com",
    messagingSenderId: "285137516179",
    appId: "1:285137516179:web:d0ccd6dbbb9b351b9dff66",
    measurementId: "G-HPLKCXVTW4"
  };
  
  let app;

  if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
  }  else{
    app = firebase.app();
  }

  export const db = app.database();
  export const auth = firebase.auth();
  export const projectFireStore = firebase.firestore();
