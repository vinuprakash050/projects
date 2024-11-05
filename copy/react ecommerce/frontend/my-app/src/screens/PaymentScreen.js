import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function PaymentScreen() {
    const navigate = useNavigate();

    const handlePayment = (e) => {
        e.preventDefault();
        alert('Payment Successful!');
        navigate('/'); // Redirect to the home screen
    };

    return (
        <div>
            <h1>Payment</h1>
            <form onSubmit={handlePayment}>
                <div className="form-group1">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input type="text" id="cardNumber" required />
                </div>
                <div className="form-group1">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input type="text" id="expiryDate" required />
                </div>
                <div className="form-group1">
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" required />
                </div>
                <button type="submit" className="Paymentbutton">Pay Now</button>
            </form>
            <div className="back-to-cart">
                <Link to="/cart">Back to Cart</Link>
            </div>
        </div>
    );
}

export default PaymentScreen;
