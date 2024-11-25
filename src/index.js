import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Ensure this path points to your App.js

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')  // Ensure this matches the "root" div in your public/index.html
);
