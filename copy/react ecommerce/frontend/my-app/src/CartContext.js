import React, { createContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const item = action.payload;
            const existItem = state.cartItems.find(x => x.id === item.id);
            let updatedCartItems;
            if (existItem) {
                updatedCartItems = state.cartItems.map(x =>
                    x.id === existItem.id ? { ...x, qty: x.qty + item.qty } : x
                );
            } else {
                updatedCartItems = [...state.cartItems, item];
            }
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems)); // Save to local storage
            return {
                ...state,
                cartItems: updatedCartItems,
                totalQuantity: updatedCartItems.reduce((acc, item) => acc + item.qty, 0), // Update total quantity
            };
        case 'REMOVE_FROM_CART':
            const filteredCartItems = state.cartItems.filter(x => x.id !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(filteredCartItems)); // Save to local storage
            return {
                ...state,
                cartItems: filteredCartItems,
                totalQuantity: filteredCartItems.reduce((acc, item) => acc + item.qty, 0), // Update total quantity
            };
        case 'DECREASE_QUANTITY':
            const itemToDecrease = action.payload;
            const existItemToDecrease = state.cartItems.find(x => x.id === itemToDecrease.id);
            let updatedCartItemsDecrease;
            if (existItemToDecrease) {
                updatedCartItemsDecrease = state.cartItems.map(x =>
                    x.id === existItemToDecrease.id ? { ...x, qty: x.qty - itemToDecrease.qty } : x
                );
            } else {
                updatedCartItemsDecrease = [...state.cartItems];
            }
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItemsDecrease)); // Save to local storage
            return {
                ...state,
                cartItems: updatedCartItemsDecrease,
                totalQuantity: updatedCartItemsDecrease.reduce((acc, item) => acc + item.qty, 0), // Update total quantity
            };
        case 'CLEAR_CART':
            localStorage.removeItem('cartItems'); // Clear cart items from local storage
            return {
                ...state,
                cartItems: [],
                totalQuantity: 0, // Reset total quantity
            };
        case 'UPDATE_TOTAL_QUANTITY':
            return {
                ...state,
                totalQuantity: action.payload,
            };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const initialState = {
        cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
        totalQuantity: 0,
    };

    const [state, dispatch] = useReducer(cartReducer, initialState);

    const getTotalQuantity = () => {
        return state.cartItems.reduce((acc, item) => acc + item.qty, 0);
    };

    return (
        <CartContext.Provider value={{ ...state, dispatch, getTotalQuantity }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
