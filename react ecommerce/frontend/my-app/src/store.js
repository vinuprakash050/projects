import { legacy_createStore as createStore, applyMiddleware, combineReducers, compose } from 'redux';
import {thunk} from 'redux-thunk';
import { productListReducer, productDetailsReducer } from './reducers/productReducers'; // Correct import
import cartReducer from './reducers/cartReducers'; // Ensure this is a default export
import { userSigninReducer, userRegisterReducer } from './reducers/productReducers'; // Assuming these are named exports

const initialState = {};

const reducer = combineReducers({
    productList: productListReducer, 
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userSignin: userSigninReducer,
    userRegister: userRegisterReducer
});

// Correctly configure the Redux DevTools extension
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));

export default store;
