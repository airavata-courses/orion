import React, { useState } from 'react';
import './App.css';
import GoogleLoginComponent from './Component/GoogleLoginComponent';
import HomePage from './Component/HomePage';

function App() {
  return (
    <div className="App-header">
      <h1> Welcome to Weather Prediction DataHouse</h1>
        <GoogleLoginComponent/>
    </div>
  );
}
 


export default App;
