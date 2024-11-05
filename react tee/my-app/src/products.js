import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick'; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function Products({ products }) 
{
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };
  return (
    <div className="products">
      <Slider {...settings}>
        {products.map(product => (
          <div key={product.id} className="product">
            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.name} />
            </Link>
            <h3>{product.name}</h3>
            <p className="price">{product.price}</p>
          </div>
        ))}
      </Slider>
    </div>
  );  
}
export default Products;
