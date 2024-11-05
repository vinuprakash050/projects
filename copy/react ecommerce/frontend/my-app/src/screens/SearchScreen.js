import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { listProducts } from '../actions/productActions';

const SearchScreen = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const searchTerm = new URLSearchParams(location.search).get('q') || '';

    const productList = useSelector(state => state.productList);
    const { products, loading, error } = productList;

    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch]);

    const filteredProducts = products ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        loading ? <div className='loading2'>Loading...</div> :
        error ? <div className='error2'>{error}</div> :
        <div className='search-screen2'>
            <h2 className='search-title2'>Search Results for "{searchTerm}"</h2>
            <ul className="products2">
                {filteredProducts && filteredProducts.map(product => (
                    <li key={product.id} className='product-item2'>
                        <div className="product2">
                            <Link to={'/products/' + product.id}>
                                <img className="product-image2" src={product.image} alt={product.name} />
                            </Link>
                            <div className="product-details2">
                                <Link to={'/products/' + product.id} className="product-name2">{product.name}</Link>
                                <div className="product-brand2">{product.brand}</div>
                                <div className="product-price2">{product.price}</div>
                                <div className="product-rating2">{product.rating} Stars ({product.numreviews}) reviews</div>
                                <Link to={'/products/' + product.id}><button className="button2">Buy Now</button></Link>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchScreen;
