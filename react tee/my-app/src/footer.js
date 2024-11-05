import React from 'react';
import './footer.css'; // Import the CSS file

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            XIKA is your go-to destination for the latest in fashion. We offer high-quality, eco-friendly clothing that makes you feel confident and unique.
          </p>
        </div>
        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li><a href="#contact-us">Contact Us</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#returns">Returns</a></li>
            <li><a href="#shipping">Shipping</a></li>
            <li><a href="#track-order">Track Order</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <ul className="social-media">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Newsletter</h3>
          <p>Subscribe to our newsletter to get the latest updates and offers.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 XIKA. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
