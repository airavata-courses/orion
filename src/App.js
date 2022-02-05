import React, { useState } from 'react';
import './App.css';
import HomePage from './Component/HomePage';
import GoogleLoginComp from './Component/GoogleLoginComp';
import GoogleLogoutComp from './Component/GoogleLogoutComp';
import GoogleLoginComponent from './Component/GoogleLoginComponent';


import { BrowserRouter, Route, Switch } from 'react-router-dom';




function App() {
  return (
    <div className="App-header">
      <h1> Welcome to Weather Prediction DataHouse</h1>
       <GoogleLoginComponent/>
    </div>
  );
}
 


export default App;
