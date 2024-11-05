import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Main from './components/Main';
import Login from './components/Login';
import Register from './components/Register';
import Pricing from './components/Pricing';
import ThankYou from './components/Thankyou';
import DoctorInterface from './components/Doctorpage';
import Appointments from './components/appointments';
import UserAppointments from './components/Userappointments';
import DoctorProfile from './components/DoctorProfile'; // Import the new component

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Main />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/doctor" element={<DoctorInterface />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/userappointments" element={<UserAppointments />} />
        <Route path="/doctorprofile" element={<DoctorProfile />} /> {/* Add the new route */}
      </Routes>
      <footer>
        <p>© 2024 Medical Appointment Booking</p>
      </footer>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
