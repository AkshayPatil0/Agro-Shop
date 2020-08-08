import Post from "../../models/post";

import '../../firebase'

import * as firebase from 'firebase'

export const ADD_POSTS = "add_posts";
export const GET_POSTS = "get_posts";

var storageRef = firebase.storage().ref();

const uploadToFirebase = async (blob, id) => {
  return new Promise((resolve, reject)=>{
    storageRef.child(`posts/${id}`).put(blob, {
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

export const addPosts = (post) => {
    return async dispatch => {
      var id = 'post-' + Date.now().toString() + '.jpg'
      const blob = await uriToBlob(post.image)
      const img = await uploadToFirebase(blob, id)
      const newPost = {
        ...post,
        image: img
      }
      const response = await fetch("https://farmer-app-54614.firebaseio.com/posts.json", {
        method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(newPost)
      } )
      const resData = await response.json()
      const uri = await storageRef.child(`posts/${id}`).getDownloadURL()
      const user = {id: post.sender.id, name: post.sender.name, phone: post.sender.phone}
      const resPost = new Post(resData.id, user, uri, post.description, post.type, post.location, post.time )
      dispatch({
          type: ADD_POSTS,
          payload: resPost
      })
    }
}

export const getPosts = () => {
  return async dispatch => {
    const response = await fetch("https://farmer-app-54614.firebaseio.com/posts.json")
    const resData = await response.json()
    let posts = []
    for(var key in resData){
      posts.push({...resData[key], id: key, image: await storageRef.child(`posts/${resData[key].image}`).getDownloadURL()})
    }
    dispatch({
      type: GET_POSTS,
      payload: posts
    })
  }
}