import React from 'react';
import { Router } from 'react-router-dom';
import './App.css'
import AppRouter from './routers/AppRouter';
export const history = require("history").createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <AppRouter/>
    </Router>
  );
}

export default App;
