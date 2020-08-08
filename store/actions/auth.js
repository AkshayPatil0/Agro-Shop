import '../../firebase'
import * as firebase from 'firebase'
import { AsyncStorage } from 'react-native';
export const LOGIN = "login";
export const SIGNUP = "signup";
export const LOGOUT = "logout";
export const GET_PROFILE = 'get-profile'
export const UPDATE_PROFILE = 'update-profile'
export const AUTHENTICATE = 'authenticate'
export const GET_CONTACTS = 'get-contacts'
export const ADD_CONTACT = 'add-contact'
export const DELETE_CONTACT = 'add-contact'

const dbRef = firebase.database().ref("user")
const storageRef = firebase.storage().ref()

const uploadToFirebase = async (blob, id) => {
    return new Promise((resolve, reject)=>{
      storageRef.child(`users/${id}`).put(blob, {
        contentType: 'image/jpeg'
      }).then((snapshot)=>{
        blob.close();
        resolve(id);
      }).catch((error)=>{
        reject(error);
      });
    })
  }
  
  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      
      xhr.onerror = function() {
        reject(new Error('uriToBlob failed'));
      };
  
      xhr.responseType = 'blob';
  
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  }

export const authSignUp = (user) => {
    return async dispatch => {

        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDACEJ36mIEOB5d2Vp7iVqG3gM0Kieja4w",
        {
            method: "POST",
            headers: {
                "Contant-Type": 'application/json'
            },
            body: JSON.stringify(user.user)
        })
        if(!response.ok){
            const resErr = await response.json()
            const err = resErr.error.message
            let message = "Something went wrong !!"
            if(err === 'EMAIL_EXISTS'){
                message = "This email already exists !!"
            }else if(err === 'INVALID_EMAIL'){
                message = "Email is not valid !!"
            }else{
                message = err
            }
            throw new Error(message)
        }
        const resData = await response.json()
        const userData = {
            ...user.data,
        }
        var onComplete = function(error) {
            if (error) {
                throw new Error(error.message)
            } else {
                dispatch({
                    type: SIGNUP,
                    payload: {token: resData.idToken, id: resData.localId, ...userData}
                })
            }
        };
        await dbRef.child(resData.localId).set(userData, onComplete)
        AsyncStorage.setItem('user', 
            JSON.stringify({token: resData.idToken, 
                id: resData.localId, ...userData, 
                expiry: +resData.expiresIn*1000 + Date.now()}) )
    }
}

export const authLogin = (user) => {
    return async dispatch => {
 
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDACEJ36mIEOB5d2Vp7iVqG3gM0Kieja4w",
        {
            method: "POST",
            headers: {
                "Contant-Type": 'application/json'
            },
            body: JSON.stringify(user)
        })
        if(!response.ok){
            const resErr = await response.json()
            const err = resErr.error.message
            let message = "Something went wrong !!"
            if(err === 'EMAIL_NOT_FOUND'){
                message = "This email dosn't exists !!"
            }else if (err === 'INVALID_PASSWORD'){
                message = "Entered password is incorrect !!"
            }else if(err === 'INVALID_EMAIL'){
                message = "Email is not valid !!"
            }else {
                message= err
            }
            throw new Error(message)
        }
        const resData = await response.json()
        
        const snapshot = await dbRef.child(resData.localId).once('value')
        const {name, phone, image } = snapshot.val()
        
        dispatch({
            type: LOGIN,
            payload: {token: resData.idToken, id: resData.localId, name, phone, image}
        })
        AsyncStorage.setItem('user', 
            JSON.stringify({token: resData.idToken, 
                id: resData.localId, name, phone, image, 
                expiry: +resData.expiresIn*1000 + Date.now()}) )
    }
}
export const getProfile = (id) => {
    return async dispatch => {
        if(id === undefined){
            return
        }
        const snapshot = await dbRef.child(id).once('value')
        const {name, phone} = snapshot.val()
        try{
            const uri = await storageRef.child(`users/${id}`).getDownloadURL()
            dispatch({
                type: GET_PROFILE,
                payload: {name, phone, image: uri}
            })
        }catch(err){
            dispatch({
                type: GET_PROFILE,
                payload: {name, phone, image: null}
            })
        }
    }
}
export const updateProfile = (user) => {
    return async dispatch => {
        const blob = await uriToBlob(user.data.image)
        await uploadToFirebase(blob, user.id)
        var img = null 
        try{
            img = await storageRef.child(`users/${user.id}`).getDownloadURL()
        }catch(err){
        }
        const userData = {
            ...user.data,
            image: img
        }
        var onComplete = function(error) {
            if (error) {
                throw new Error('Something went wrong !!')
            } else {
                dispatch({
                    type: UPDATE_PROFILE,
                    payload: {...userData}
                })
            }
        };
        await dbRef.child(user.id).set(userData, onComplete)   
    }
}

export const logout = () => {
    return async dispatch => {

        await AsyncStorage.clear()
    
        dispatch({
            type: LOGOUT,
        })
    }
}

export const authenticate = (response) => {
    return {
        type: AUTHENTICATE,
        payload: response
    }
}

export const getContacts = (id) => {
    return async dispatch => {

        const snapshot = await dbRef.child(id).once('value')
        var contacts = snapshot.child('contacts').val()
        dispatch ({
            type: GET_CONTACTS,
            payload: contacts
        })
    }
}

export const addContact = (id, sender) => {
    return async dispatch => {

        const snapshot = await dbRef.child(id).once('value')
        var contacts = snapshot.child('contacts').val()

        if(contacts !== null){
            for(var contact of contacts){
                if(contact.id === sender.id)
                return
            }
            contacts.push(sender)
        }else{
            contacts = [sender]
        }
        try{
            var onComplete = function(error) {
                if (error) {
                    throw new Error('Something went wrong !!')
                } else {
                    dispatch({
                        type: ADD_CONTACT,
                        payload: contacts
                    })
                }
            };
            await dbRef.child(`${id}/contacts`).set(contacts, onComplete)
        }catch(err){
            throw new Error('Something went wrong !!')
        }
        dispatch ({
            type: ADD_CONTACT,
            payload: contacts
        })
    }
}
export const deleteContact = (id, sender_id) => {
    return async dispatch => {
        const snapshot = await dbRef.child(id).once('value')
        var contacts = snapshot.child('contacts').val()
        var senderIndex = -1
        for(var i=0; i < contacts.length; i++){
            if(contacts[i].id === sender_id){
                senderIndex = i;
                break
            }
        }
        if(senderIndex === -1){
            return
        }
        
        contacts.splice(senderIndex, 1)
        try{
            var onComplete = function(error) {
                if (error) {
                    throw new Error('Something went wrong !!')
                } else {
                    dispatch({
                        type: ADD_CONTACT,
                        payload: contacts
                    })
                }
            };
            await dbRef.child(`${id}/contacts`).set(contacts, onComplete)
        }catch(err){
            throw new Error('Something went wrong !!')
        }
        dispatch ({
            type: DELETE_CONTACT,
            payload: contacts
        })
    }
}