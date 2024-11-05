import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';
import { CartProvider } from './CartContext'; // Ensure this matches the file name exactly

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <CartProvider>
      <App />
    </CartProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
