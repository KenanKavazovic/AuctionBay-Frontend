import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UserReducer from './interfaces/reducer/User.reducer';
import axios from 'axios';
import './index.css';

axios.defaults.baseURL = 'http://localhost:8080/';
//axios.defaults.baseURL = 'https://auctionbay-backend-hs97.onrender.com';
axios.defaults.withCredentials = true
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const store = configureStore({
  reducer:{
    user: UserReducer
  }
});
root.render(
  <Provider store={store}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
