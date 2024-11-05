import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listProducts } from '../actions/productActions';

function HomeScreen(props) {
    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList);
    const { products, loading, error } = productList;

    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch]);
    const pantProducts = products ? products.filter(product => product.category === 'pant') : [];
    return (
        loading ? <div className='loading'>Loading...</div> :
        error ? <div>{error}</div> :
        <ul className="products1">
            {pantProducts && pantProducts.map(product => {
                console.log('Product ID:', product.id); // Debugging log
                return (
                    <li key={product.id}>
                        <div className="product1">
                            <Link to={'/products/' + product.id}>
                                <img className="product-image1"src={product.image} alt={product.shirtname} />
                            </Link>
                            <div className="product-name1">
                                <Link to={'/products/' + product.id}>{product.shirtname}</Link>
                            </div>
                            <div className="product-brand1">{product.brand}</div>
                            <div className="product-price1">{product.price}</div>
                            <div className="product-rating1">{product.rating} Stars ({product.numreviews}) reviews</div>
                            <Link to={'/products/' + product.id}><button className="button1">Buy Now</button></Link>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

export default HomeScreen;
