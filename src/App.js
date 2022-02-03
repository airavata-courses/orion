import React, { useState } from 'react';
import './App.css';
import HomePage from './Component/HomePage';
import Login from './Component/Login'
import useToken from './Component/useToken';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import GoogleLogin from 'react-google-login';


function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));

}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}

function App() {
  const { token, setToken } = useToken();

  if(!token) {
    return <Login setToken={setToken} />
  }
  return (
    <div >
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <Login  />
          </Route>
          <Route path="/home">
            <HomePage />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
