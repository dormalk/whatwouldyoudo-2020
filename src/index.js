import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import configureStore from './store/configureStore';
import * as serviceWorker from './serviceWorker';
import {initializedFirebaseApp} from './configs/firebase';
import {fetchUserData,logout, LOGIN} from './actions/auth';
import { Provider } from 'react-redux';

const store = configureStore();

const jsx = (
  <Provider store={store}>
    <App />
  </Provider>
);





initializedFirebaseApp.auth().onAuthStateChanged(user => {
  if(user) {
    const {displayName,email,photoURL,uid} = user;
    const userData = {
        displayName,email,photoURL,uid
    }
    store.dispatch({type: LOGIN, payload: userData})
    store.dispatch(fetchUserData(user.uid))
  }
  else store.dispatch(logout())
  ReactDOM.render(jsx, document.getElementById('root'));

})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
