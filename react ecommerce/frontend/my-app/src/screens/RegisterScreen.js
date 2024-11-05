import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../actions/productActions';
import { USER_REGISTER_RESET } from '../constants/productConstants';

function RegisterScreen(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userRegister = useSelector(state => state.userRegister);
    const { userInfo, error } = userRegister || {};

    useEffect(() => {
        if (userInfo) {
            navigate('/signin');
        }
        return () => {
            dispatch({ type: USER_REGISTER_RESET });
        };
    }, [userInfo, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(name, email, password));
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h1>Register</h1>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                {error && <div className="error2">{error}</div>}
                <button type="submit" className="buttonSign">Register</button>
                <div className="signin-link">
                    Already have an account? <Link to="/signin">Sign In</Link>
                </div>
            </form>
        </div>
    );
}

export default RegisterScreen;
