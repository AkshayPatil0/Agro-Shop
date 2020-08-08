import { LOGIN, SIGNUP, LOGOUT, AUTHENTICATE, UPDATE_PROFILE, GET_PROFILE, GET_CONTACTS, ADD_CONTACT, DELETE_CONTACT } from "../actions/auth"

initialState = {}

export const authReducer = (state= initialState, action) => {
    switch(action.type){
    case LOGIN:
        return {
            ...state,
            token: action.payload.token,
            id: action.payload.id,
            name: action.payload.name,
            phone: action.payload.phone,
            image: action.payload.image
        }
    case SIGNUP:
        return {
            ...state,
            token: action.payload.token,
            id: action.payload.id,
            name: action.payload.name,
            phone: action.payload.phone,
            image: action.payload.image
        }
    case LOGOUT :
        return {}
    case AUTHENTICATE :
        return {
            ...state,
            ...action.payload
        }

    case GET_PROFILE:
        return {
            ...state,
            ...action.payload
        }
    case UPDATE_PROFILE :
        return {
            ...state,
            ...action.payload
        }
    case GET_CONTACTS :
        return {
            ...state,
            contacts: action.payload
        }
    case ADD_CONTACT :
        return {
            ...state,
            contacts: action.payload
        }
    case DELETE_CONTACT :
        return {
            ...state,
            contacts: action.payload
        }
    default:
        return state
    }
}