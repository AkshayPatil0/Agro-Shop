import * as firebase from 'firebase';

const firebaseConfig = {
    //firebase config
  };
  
export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
  
