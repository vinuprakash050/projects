import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; // Import the CSS file
import Header from './Header';
import Main from './Main';
import Products from './products'; // Ensure the case matches the filename
import Video from './video'; // Ensure the case matches the filename
import BestSellerProduct from './bestsellerproduct'; // Ensure the case matches the filename
import Footer from './footer'; // Ensure the case matches the filename
import ProductDetails from './productDetails'; // Ensure the case matches the filename
import Cart from './cart'; // Import the Cart component
import AboutUs from './aboutus'; // Import the About Us component
import Login from './login'; // Import the Login component
import Register from './register'; // Import the Register component
import NewArrival from './newarrival'; // Import the New Arrival component

const products = [
  { id: 1, name: 'Anime Oversized', image: '/shirt.png', description: 'Comfortable and stylish oversized shirt with anime print.', price: '$25.00' },
  { id: 2, name: 'One Piece Oversized', image: '/shirt.png', description: 'Oversized shirt featuring One Piece characters.', price: '$30.00' },
  { id: 3, name: 'Naruto Oversized', image: '/shirt.png', description: 'Oversized shirt featuring Naruto characters.', price: '$28.00' },
  { id: 4, name: 'Dragon Ball Oversized', image: '/shirt.png', description: 'Oversized shirt featuring Dragon Ball characters.', price: '$26.00' },
  { id: 5, name: 'Attack on Titan Oversized', image: '/shirt.png', description: 'Oversized shirt featuring Attack on Titan characters.', price: '$29.00' }
];

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Main />
              <Products products={products} />
              <Video />
              <BestSellerProduct />
            </>
          } />
          <Route path="/product/:id" element={<ProductDetails products={products} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/new-arrival" element={<NewArrival products={products} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
