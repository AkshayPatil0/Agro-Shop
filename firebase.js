import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDACEJ36mIEOB5d2Vp7iVqG3gM0Kieja4w",
    authDomain: "farmer-app-54614.firebaseapp.com",
    databaseURL: "https://farmer-app-54614.firebaseio.com",
    projectId: "farmer-app-54614",
    storageBucket: "farmer-app-54614.appspot.com",
    messagingSenderId: "672812562257",
    appId: "1:672812562257:web:afc9656889303b00ef4570",
    measurementId: "G-3Y4LV388F7"
  };
  
export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
  