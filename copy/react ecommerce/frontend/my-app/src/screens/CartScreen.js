import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CartContext from '../CartContext';

function CartScreen() {
    const {  dispatch } = useContext(CartContext);
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartDetails = async () => {
            if (userInfo && userInfo.id) {
                try {
                    const response = await fetch(`/api/users/${userInfo.id}/cart`);
                    const data = await response.json();
                    console.log('Fetched Cart Data:', data); // Debugging log
                    if (data.cartItems) {
                        setCartItems(data.cartItems);
                    } else {
                        console.error('No cart items found in response');
                    }
                } catch (error) {
                    console.error('Error fetching cart details:', error);
                }
            } else {
                // Fetch cart details from local storage if user is not signed in
                const localCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                console.log('Fetched Cart Data from local storage:', localCartItems); // Debugging log
                setCartItems(localCartItems);
            }
        };

        console.log('User Info:', userInfo); // Debugging log

        fetchCartDetails();
    }, [userInfo]);

    console.log('Cart Items in CartScreen:', cartItems); // Debugging log

    const removeFromCartHandler = async (cart_product_id) => {
        console.log('Removing product with ID:', cart_product_id); // Debugging log
        console.log('Current cart items:', cartItems); // Debugging log
    
        if (userInfo && userInfo.id) {
            try {
                const response = await fetch('/api/users/remove-from-cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: userInfo.id, productId: cart_product_id }),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    console.log('Removed Cart Data:', data); // Debugging log
                    setCartItems(prevItems => {
                        const updatedItems = prevItems.filter(item => item.id !== cart_product_id);
                        console.log('Updated cart items after remove:', updatedItems); // Debugging log
    
                        // Calculate the new total quantity
                        const newTotalQuantity = updatedItems.reduce((acc, item) => acc + item.cart_quantity, 0);
                        console.log('New Total Quantity:', newTotalQuantity); // Debugging log
    
                        // Update total quantity on the server
                        updateTotalQuantityHandler1(newTotalQuantity);
    
                        return updatedItems;
                    });
                    dispatch({
                        type: 'REMOVE_FROM_CART',
                        payload: cart_product_id,
                    });
                } else {
                    console.error('Failed to remove item from cart');
                }
            } catch (error) {
                console.error('Error removing item from cart:', error);
            }
        } else {
            // Update cart items in local storage if user is not signed in
            setCartItems(prevItems => {
                const updatedItems = prevItems.filter(item => item.id !== cart_product_id);
                localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                console.log('Updated cart items after remove (local storage):', updatedItems); // Debugging log
    
                // Calculate the new total quantity
                const newTotalQuantity = updatedItems.reduce((acc, item) => acc + item.cart_quantity, 0);
                console.log('New Total Quantity:', newTotalQuantity); // Debugging log
    
                // Update total quantity on the server
                updateTotalQuantityHandler1(newTotalQuantity);
    
                return updatedItems;
            });
            dispatch({
                type: 'REMOVE_FROM_CART',
                payload: cart_product_id,
            });
        }
    };
    
    // Function to update total quantity on the server
    const updateTotalQuantityHandler1 = async (totalQuantity) => {
        console.log('Total Quantity:', totalQuantity); // Debugging log
    
        try {
            const response = await fetch('/api/users/update-total-quantity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userInfo.id, totalQuantity }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Updated Total Quantity Data:', data); // Debugging log
            } else {
                console.error('Failed to update total quantity');
            }
        } catch (error) {
            console.error('Error updating total quantity:', error);
        }
    };
    
    

    const decreaseQtyHandler = async (cart_product_id) => {
        console.log('Cart Items before decrease:', cartItems);
        console.log('Product ID to decrease:', cart_product_id);
    
        const item = cartItems.find(x => x.id === cart_product_id);
        if (!item) {
            console.error(`Item with id ${cart_product_id} not found in cartItems`);
            return;
        }
    
        if (item.cart_quantity > 1) {
            if (userInfo && userInfo.id) {
                try {
                    console.log('Sending product ID to server:', cart_product_id); // Debugging log
                    const response = await fetch('/api/users/decrease-qty', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userId: userInfo.id, productId: cart_product_id }),
                    });
    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Decreased Quantity Data from server:', data); // Debugging log
                        setCartItems(prevItems => {
                            const updatedItems = prevItems.map(x => 
                                x.id === cart_product_id ? { ...x, cart_quantity: x.cart_quantity - 1 } : x
                            );
                            console.log('Updated cart items after decrease:', updatedItems); // Debugging log
                            return updatedItems;
                        });
                        dispatch({
                            type: 'DECREASE_QUANTITY',
                            payload: { id: cart_product_id, qty: 1 },
                        });
                        updateTotalQuantityHandler(); 
                    } else {
                        console.error('Failed to decrease item quantity');
                    }
                } catch (error) {
                    console.error('Error decreasing item quantity:', error);
                }
            } else {
                // Update cart items in local storage if user is not signed in
                setCartItems(prevItems => {
                    const updatedItems = prevItems.map(x => 
                        x.id === cart_product_id ? { ...x, cart_quantity: x.cart_quantity - 1 } : x
                    );
                    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                    console.log('Updated cart items after decrease (local storage):', updatedItems); // Debugging log
                    return updatedItems;
                });
                dispatch({
                    type: 'DECREASE_QUANTITY',
                    payload: { id: cart_product_id, qty: 1 },
                });
            }
        } else {
            console.log('Quantity is 1, calling removeFromCartHandler'); // Debugging log
            removeFromCartHandler(cart_product_id);
        }
    };
    

    const updateTotalQuantityHandler = async () => {
        const totalQuantity = cartItems.reduce((acc, item) => acc + item.cart_quantity, 0)-1;
        console.log('Total Quantity1:', totalQuantity); // Debugging log
        try {
            const response = await fetch('/api/users/update-total-quantity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userInfo.id, totalQuantity }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Updated Total Quantity Data:', data); // Debugging log
            } else {
                console.error('Failed to update total quantity');
            }
        } catch (error) {
            console.error('Error updating total quantity:', error);
        }
    };

    const getTotalQuantity = () => {
        return cartItems.reduce((acc, item) => acc + item.cart_quantity, 0);
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.cart_quantity * item.price, 0);
    const cgst = (subtotal * 0.09).toFixed(2);
    const sgst = (subtotal * 0.09).toFixed(2);
    const deliveryCharge = 50; // Example delivery charge
    const totalPrice = (parseFloat(subtotal) + parseFloat(cgst) + parseFloat(sgst) + deliveryCharge).toFixed(2);

    const proceedToPaymentHandler = () => {
        navigate('/checkout');
    };

    return (
        <div className="cart-screen">
            <div className="cart-items">
                <h5>Shopping Cart</h5>
                {cartItems.length === 0 ? (
                    <div>
                        Cart is empty. <Link to="/">Go Shopping</Link>
                    </div>
                ) : (
                    <ul>
                        {cartItems.map(item => {
                            console.log('Key value:', item.id); // Log the key value
                            return (
                                <li key={item.id}>
                                    <div className='cart-item'>
                                        <img src={item.image} alt={item.name} />
                                        <div className='cart-item-info'>
                                            <Link to={`/products/${item.id}`}>{item.name}</Link>
                                            <div>
                                                Quantity: {item.cart_quantity||item.qty}
                                                <button onClick={() => decreaseQtyHandler(item.id)} className='button1'>-</button>
                                                <button onClick={() => removeFromCartHandler(item.id)} className='button1'>Remove</button>
                                            </div>
                                            <div>
                                                Price: {item.price}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
            <div className="cart-summary">
                <h4>Order Summary</h4>
                <h6>Subtotal ({getTotalQuantity()} items): ${subtotal}</h6>
                <h6>CGST (9%): ${cgst}</h6>
                <h6>SGST (9%): ${sgst}</h6>
                <h6>Delivery Charge: ${deliveryCharge}</h6>
                <h4>Total: ${totalPrice}</h4>
                <button onClick={proceedToPaymentHandler} className='Paymentbutton'>
                    Proceed to payment
                </button>
            </div>
        </div>
    );
}

export default CartScreen;
