import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './productDetails.css'; // Import the CSS file

const ProductDetails = ({ products }) => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    // Add to cart logic here
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  return (
    <div className="product-details1">
      <img src={product.image} alt={product.name} />
      <div className="product-details-content1">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p className="price">{product.price}</p>
        <div className="product-sizes">
          <h3>Available Sizes</h3>
          <div className="sizes">
            {['S', 'M', 'L', 'XL'].map(size => (
              <button
                key={size}
                className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div className="product-quantity">
          <h3>Quantity</h3>
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <button className="add-to-cart" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
