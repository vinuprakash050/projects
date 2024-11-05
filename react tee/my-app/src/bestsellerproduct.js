import React from 'react';
import { Link } from 'react-router-dom';

function BestSellerProduct() {
  const products = [
    { id: 1, name: 'Anime Oversized', image: '/shirt.png', description: 'Comfortable and stylish oversized shirt with anime print.', price: '$25.00' },
    { id: 2, name: 'One Piece Oversized', image: '/shirt.png', description: 'Oversized shirt featuring One Piece characters.', price: '$30.00' },
    { id: 3, name: 'Naruto Oversized', image: '/shirt.png', description: 'Oversized shirt featuring Naruto characters.', price: '$28.00' },
    { id: 4, name: 'Dragon Ball Oversized', image: '/shirt.png', description: 'Oversized shirt featuring Dragon Ball characters.', price: '$26.00' },
    { id: 5, name: 'Attack on Titan Oversized', image: '/shirt.png', description: 'Oversized shirt featuring Attack on Titan characters.', price: '$29.00' }
  ];
  const bestSeller = products[Math.floor(Math.random() * products.length)];

  return (
    <div className="best-seller">
      <h2>Best Seller</h2>
      <div className="best-product">
        <img src={bestSeller.image} alt={bestSeller.name} />
        <div className="best-product-details">
          <h3>{bestSeller.name}</h3>
          <p>{bestSeller.description}</p>
          <p className="price">{bestSeller.price}</p>
          <Link to={`/product/${bestSeller.id}`}>
            <button className="add-to-cart">View Product</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BestSellerProduct;
