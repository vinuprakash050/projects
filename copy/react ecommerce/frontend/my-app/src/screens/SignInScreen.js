import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signin } from '../actions/productActions';

function SignInScreen(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userSignin = useSelector(state => state.userSignin);
    const { userInfo, loading, error } = userSignin;

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [userInfo, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signin(email, password));
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="signin-container">
            <form className="signin-form" onSubmit={handleSubmit}>
                <h1>Sign In</h1>
                {loading && <div className="loading2">Loading...</div>}
                {error && <div className="error2">{error}</div>}
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
                <button type="submit" className="buttonSign">Sign In</button>
                <div className="register-link">
                    New customer? <span onClick={handleRegisterClick} style={{ cursor: 'pointer', color: 'blue' }}>Create your account</span>
                </div>
            </form>
        </div>
    );
}

export default SignInScreen;
