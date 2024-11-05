import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { detailsProduct } from '../actions/productActions';
import CartContext from '../CartContext';
import axios from 'axios';

function ProductScreen() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const productDetails = useSelector(state => state.productDetails);
    const { product, loading, error } = productDetails;
    const { dispatch: cartDispatch, getTotalQuantity } = useContext(CartContext);
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const [qty, setQty] = useState(1);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const fetchTotalQuantity = async () => {
        try {
            const response = await fetch(`/api/users/${userInfo.id}/total-quantity`);
            if (response.ok) {
                const data = await response.json();
                cartDispatch({ type: 'UPDATE_TOTAL_QUANTITY', payload: data.totalQuantity });
            } else {
                console.error('Failed to fetch total quantity');
            }
        } catch (error) {
            console.error('Error fetching total quantity:', error);
        }
    };

    useEffect(() => {
        dispatch(detailsProduct(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (product) {
            console.log('Product received:', product); // Log the product details to the console
        }
    }, [product]);

    const addToCartHandler = async () => {
        console.log('Adding to cart:', product, 'Quantity:', qty);
        setOverlayVisible(true);
        setTimeout(() => setOverlayVisible(false), 3000); // Hide overlay after 3 seconds
    
        try {
            // Calculate the total quantity
    
            const response = await axios.post('/api/users/add-to-cart', {
                userId: userInfo.id,
                productIds: [product.id], // Send productIds as an array
                quantities: [parseInt(qty)], // Send quantities as an array
            });
            console.log('Cart item added to database:', response.data);
            await fetchTotalQuantity();
        } catch (error) {
            console.error('Error adding cart item to database:', error);
        }
    };
    
/*
    const addToCartHandler = () => {
        console.log('Adding to cart:', product, 'Quantity:', qty);
        cartDispatch({
            type: 'ADD_TO_CART',
            payload: { ...product, qty: parseInt(qty) },
        });
        setOverlayVisible(true);
        setTimeout(() => setOverlayVisible(false), 3000); // Hide overlay after 3 seconds
    };*/



    return (
        <div>
            <div className='backtoresult'>
                <Link to="/">Back</Link>
            </div>
            {overlayVisible && <div className='overlay'>✔️Item added to cart!</div>}
            {loading ? <div>Loading...</div> :
            error ? <div>{error}</div> :
            <div className='details'>
                <div className='details-image'>
                    <img src={product.image} alt={product.name} />
                </div>
                <div className='detailcontainer'>
                    <div className='details-info'>
                        <ul>
                            <li>
                                <h4>{product.name}</h4>
                            </li>
                            <li>
                                Brand: {product.brand}
                            </li>
                            <li>
                                {product.rating ? Array(Math.round(product.rating)).fill('★').join('') : 'No rating'} ({product.numreviews} Reviews)
                            </li>
                            <li>
                                Price: <b>{product.price}</b>
                            </li>
                            <li>
                                Description:
                                <div>
                                    {product.description}
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* New Section for Additional Details */}
                    <div className='details-additional'>
                        <h4>Additional Details</h4>
                        <ul>
                            <li>Material: {product.material}</li>
                            <li>Color: {product.color}</li>
                            <li>Size: {product.size}</li>
                            <li>Care Instructions: {product.careInstructions}</li>
                        </ul>
                    </div>
                </div>
        <div className='detailcontainer'>
            <div className='details-action'>
                <ul>
                    <li>
                        Price: {product.price}
                    </li>
                    <li>
                        Status: {product.status}
                    </li>
                    <li>
                        Qty:
                        <select value={qty} onChange={(e) => setQty(e.target.value)}>
                            {[...Array(6).keys()].map(x =>
                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                            )}
                        </select>
                    </li>
                    <li>
                        <button onClick={addToCartHandler} className='button'>Add to Cart</button>
                    </li>
                </ul>
            </div>
            
            {/* Structured Reviews Section */}
            <div className='details-action1'>
                <h2>Reviews:</h2>
                <div className='review'>
                    <h5>George</h5>
                    <p>The t-shirt was the best! Great quality and fit.</p>
                </div>
                <div className='review'>
                    <h5>Anna</h5>
                    <p>Very comfortable and stylish. Highly recommend!</p>
                </div>
                <div className='review'>
                    <h5>Michael</h5>
                    <p>Good value for money. Will buy again.</p>
                </div>
            </div>
        </div>
    </div>}
</div>

    );
}

export default ProductScreen;
