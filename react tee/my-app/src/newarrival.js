import React from 'react';
import { Link } from 'react-router-dom';
import './newarrival.css'; // Import the CSS file

const NewArrival = ({ products }) => {
  return (
    <div className="new-arrival">
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.name} />
            </Link>
            <h3>{product.name}</h3>
            <p className="price">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewArrival;
