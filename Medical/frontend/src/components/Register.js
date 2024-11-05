import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../Actions/registerActions';
import '../styles/register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [doctorId, setDoctorId] = useState('');
  const [experience, setExperience] = useState('');
  const [hospital, setHospital] = useState('');
  const [specialistIn, setSpecialistIn] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    if (role === 'doctor') {
      formData.append('doctorId', doctorId);
      formData.append('experience', experience);
      formData.append('hospital', hospital);
      formData.append('specialistIn', specialistIn);
    }
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    // Log form data
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const result = await dispatch(registerUser(formData));

    if (result.success) {
      navigate('/login'); // Navigate to login after successful registration
    } else {
      setErrorMessage(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          Register as:
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="user">User</option>
            <option value="doctor">Doctor</option>
          </select>
        </label>
        {role === 'doctor' && (
          <>
            <label>
              Doctor ID:
              <input type="text" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required />
            </label>
            <label>
              Experience:
              <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} required />
            </label>
            <label>
              Hospital:
              <input type="text" value={hospital} onChange={(e) => setHospital(e.target.value)} required />
            </label>
            <label>
              Specialist In:
              <input type="text" value={specialistIn} onChange={(e) => setSpecialistIn(e.target.value)} required />
            </label>
            <label>
              Profile Picture:
              <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} />
            </label>
          </>
        )}
        <button type="submit">Register</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default Register;
