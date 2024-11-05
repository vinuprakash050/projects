import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listProducts } from '../actions/productActions';

function HomeScreen(props) {
  const dispatch = useDispatch();
  const productsRef = useRef(null);
  const productsRef1 = useRef(null);

  const productList = useSelector((state) => state.productList);
  const { products, loading, error } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  const slideLeft = () => {
    if (productsRef.current) {
      productsRef.current.scrollBy({ left: -370, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (productsRef.current) {
      productsRef.current.scrollBy({ left: 370, behavior: 'smooth' });
    }
  };

  const slideLeft1 = () => {
    if (productsRef1.current) {
      productsRef1.current.scrollBy({ left: -370, behavior: 'smooth' });
    }
  };

  const slideRight1 = () => {
    if (productsRef1.current) {
      productsRef1.current.scrollBy({ left: 370, behavior: 'smooth' });
    }
  };

  const pantProducts = products ? products.filter((product) => product.category === 'pant') : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    'https://images-eu.ssl-images-amazon.com/images/G/31/LEO/Jup24/Phase1/2/FDFO_bank_PC_Header_1500x30055.gif',
    './images/banner.jpg',
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return loading ? (
    <div className="loading">Loading...</div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>
      {/* Carousel Section */}
      <div className="carousel-container">
        <div className="carousel-slide" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((src, index) => (
            <img key={index} className="carousel-image" src={src} alt={`Slide ${index}`} />
          ))}
        </div>
        <div className="carousel-buttons" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
          <button className="carousel-button" onClick={prevSlide}>
            ❮
          </button>
          <button className="carousel-button" onClick={nextSlide}>
            ❯
          </button>
        </div>
      </div>

      {/* New Arrivals Section */}
      <h2 className="h2h">New Arrivals</h2>
      <div className="product-slider">
        <button className="slide-left" onClick={slideLeft}>
          ❮
        </button>

        <ul className="products" ref={productsRef}>
          {products &&
            products.map((product) => (
              <li key={product.id}>
                <div className="product">
                  <Link to={'/products/' + product.id}>
                    <img src={product.image} alt={product.shirtname} />
                  </Link>
                  <div className="product-name">
                    <Link to={'/products/' + product.id}>{product.shirtname}</Link>
                  </div>
                  <div className="product-brand">{product.brand}</div>
                  <div className="product-rating">
                    {product.rating} Stars ({product.numreviews}) reviews
                  </div>
                  <Link to={'/products/' + product.id}>
                    <button className="button">Buy Now</button>
                  </Link>
                </div>
              </li>
            ))}
        </ul>
        <button className="slide-right" onClick={slideRight}>
          ❯
        </button>
      </div>

      {/* Your Recent Searches Section */}
      <h2 className="h2h">Your recent searches</h2>
      <div className="product-slider">
        <button className="slide-left" onClick={slideLeft1}>
          ❮
        </button>
        <ul className="products" ref={productsRef1}>
          {pantProducts &&
            pantProducts.map((product) => (
              <li key={product.id}>
                <div className="product">
                  <Link to={'/products/' + product.id}>
                    <img src={product.image} alt={product.shirtname} />
                  </Link>
                  <div className="product-name">
                    <Link to={'/products/' + product.id}>{product.shirtname}</Link>
                  </div>
                  <div className="product-brand">{product.brand}</div>
                  <div className="product-rating">
                    {product.rating} Stars ({product.numreviews}) reviews
                  </div>
                  <Link to={'/products/' + product.id}>
                    <button className="button">Buy Now</button>
                  </Link>
                </div>
              </li>
            ))}
        </ul>
        <button className="slide-right" onClick={slideRight1}>
          ❯
        </button>
      </div>
    </div>
  );
}

export default HomeScreen;