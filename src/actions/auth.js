import {initializedFirebaseApp} from '../configs/firebase';
import * as firebase from 'firebase';
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER = 'UPDATE_USER';

export const loginWithGoogleProvider = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    initializedFirebaseApp.auth().signInWithPopup(provider)
}

export const fetchUserData = (userId) => {
    return(dispatch) => {
        initializedFirebaseApp.database().ref('users').child(userId)
        .once('value', snapshot => {
            const data = snapshot.val();
            console.log(data)
            if(data){
                dispatch({type: UPDATE_USER, payload: data})
            } else {
                initializedFirebaseApp.database().ref('users').set('placeholder')
            }
        })
    }
}

export const updateUserData = (userData) => {
    return(dispatch) => {
        const userId = initializedFirebaseApp.auth().currentUser.uid;

        return initializedFirebaseApp.database().ref('users').child(userId)
        .update(userData)
        .then(() => {
            dispatch({type: UPDATE_USER, payload: userData})
        })
    }

}

export const logout = () => {
    return(dispatch) => {
        initializedFirebaseApp.auth().signOut()
        .then(() => dispatch({type: LOGOUT}))
    }
}