import React from 'react';
import '../styles/pricing.css';

const Pricing = () => {
  return (
    <div className="pricing-container">
      <div className="pricing-grid">
        <div className="pricing-item">
          <h2>General Consultation</h2>
          <p className="price">$50</p>
          <p>Duration: 30 minutes</p>
          <p>Specialties: General Medicine, Pediatrics, Family Medicine</p>
          <p>Includes a comprehensive health assessment and personalized care plan.</p>
        </div>
        <div className="pricing-item">
          <h2>Specialist Consultation</h2>
          <p className="price">$100</p>
          <p>Duration: 45 minutes</p>
          <p>Specialties: Cardiology, Dermatology, Neurology, Orthopedics</p>
          <p>Includes specialized examination and tailored treatment recommendations.</p>
        </div>
        <div className="pricing-item">
          <h2>Follow-up Appointment</h2>
          <p className="price">$30</p>
          <p>Duration: 20 minutes</p>
          <p>Specialties: All</p>
          <p>Includes review of treatment progress and adjustments to care plan as needed.</p>
        </div>
        <div className="pricing-item">
          <h2>Telehealth Consultation</h2>
          <p className="price">$40</p>
          <p>Duration: 30 minutes</p>
          <p>Specialties: General Medicine, Mental Health</p>
          <p>Includes virtual assessment and follow-up care via video call.</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
