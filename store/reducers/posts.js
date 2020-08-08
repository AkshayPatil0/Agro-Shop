import { ADD_POSTS, GET_POSTS } from '../actions/posts'

const initialState = {
    posts: []
}

export const postReducer = (state= initialState, action) => {
    switch (action.type) {
        case ADD_POSTS:
            return {
                ...state,
                posts: [...state.posts, action.payload]
            }

        case GET_POSTS:
            return {
                ...state,
                posts: action.payload
            }
        default :
            return state
    }
}