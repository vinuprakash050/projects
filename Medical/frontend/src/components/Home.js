import React from 'react';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="intro">
        <h1>Welcome to Lyfa</h1>
        <p>Your trusted partner for medical appointments.</p>
        <p>Book appointments with top doctors in various specialties at your convenience.</p>
      </section>
      <div className="grid-container">
        <section className="features">
          <h2>Features</h2>
          <ul>
            <li>Easy online booking</li>
            <li>Reminders and notifications</li>
            <li>Access to medical records</li>
            <li>24/7 customer support</li>
          </ul>
        </section>
        <section className="specialties">
          <h2>Doctor Specialties</h2>
          <p>Our doctors specialize in:</p>
          <ul>
            <li>Cardiology</li>
            <li>Dermatology</li>
            <li>Neurology</li>
            <li>Pediatrics</li>
            <li>Orthopedics</li>
          </ul>
        </section>
        <section className="hospitals">
          <h2>Our Hospitals</h2>
          <p>We partner with leading hospitals to provide the best care:</p>
          <ul>
            <li>City Hospital</li>
            <li>Green Valley Medical Center</li>
            <li>Sunrise Health Clinic</li>
            <li>Downtown General Hospital</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Home;
