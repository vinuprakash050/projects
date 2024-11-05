import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css'; // Import the CSS file

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isProductDetailsPage = location.pathname.startsWith('/product/');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const closeSearch = () => {
    setShowSearch(false);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      closeSearch();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`header ${isProductDetailsPage ? 'header-product-details' : ''} ${showSearch ? 'header-search-open' : ''}`}>
      <div className="header-left">
        <Link to="/">
          <h1>XIKA</h1>
        </Link>
      </div>
      <div className="header-center">
        <nav>
          <Link to="/new-arrival">New Arrival</Link>
          <Link to="/#track-order">Track Order</Link>
          <Link to="/about-us">About Us</Link>
        </nav>
      </div>
      <div className="header-right">
        <div className="header-item" onClick={() => navigate('/login')}>
          <img src="/profile.png" alt="Sign In" /> 
        </div>
        <div className="header-item" onClick={toggleSearch}>
          <img src="/search.png" alt="Search" />
        </div>
        <div className="header-item" onClick={() => navigate('/cart')}>
          <img src="/cart.png" alt="Cart" />
        </div>
      </div>
      {showSearch && (
        <div className="search-bar" ref={searchRef}>
          <img src="/search.png" alt="Search Icon" className="search-icon" />
          <input type="text" placeholder="Search..." />
          <button className="close-search" onClick={closeSearch}>X</button>
        </div>
      )}
    </header>
  );
}

export default Header;
