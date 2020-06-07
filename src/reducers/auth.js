
import { LOGIN,LOGOUT, UPDATE_USER } from '../actions/auth';

const INITIAL_STATE = {
    user: null,
    data: {
        relatedQuestions: [],
        relatedAnswers: [],
        isOrgenazation: false
    }
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case LOGIN:
            return {
                ...state,
                user: {...action.payload}
            }
        case LOGOUT: 
            return {
                ...state,
                user: null
            }
        case UPDATE_USER: {
            return {
                ...state,
                data: action.payload
            }
        }
        default:
            return state;
    }
}