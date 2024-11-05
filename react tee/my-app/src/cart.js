import React from 'react';
import './cart.css'; // Import the CSS file

const Cart = () => {
  // Sample cart items
  const cartItems = [
    { id: 1, name: 'Anime Oversized', image: '/shirt.png', price: '$25.00', quantity: 1 },
    { id: 2, name: 'One Piece Oversized', image: '/shirt.png', price: '$30.00', quantity: 2 },
  ];

  const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.price.slice(1)) * item.quantity, 0);

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>Price: {item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h3>Total: ${totalPrice.toFixed(2)}</h3>
        <button className="checkout-button">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
