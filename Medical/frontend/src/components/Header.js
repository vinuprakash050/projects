import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = ({ user, onLogout }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    setDropdownOpen(false);
  };

  const handleLinkClick = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <Link to={user && user.role === 'doctor' ? '/doctor' : '/'} className="logo">Lyfa</Link>
      <nav className="nav">
        {user ? (
          user.role === 'doctor' ? (
            <div className="nav-item" onClick={() => handleLinkClick('/appointments')}>
              <NavLink to="/appointments" activeClassName="active-link">View your Appointments</NavLink>
            </div>
          ) : (
            <>
              <div className="nav-item" onClick={() => handleLinkClick('/book')}>
                <NavLink to="/book" activeClassName="active-link">Book Appointments</NavLink>
              </div>
              <div className="nav-item" onClick={() => handleLinkClick('/pricing')}>
                <NavLink to="/pricing" activeClassName="active-link">See Pricing</NavLink>
              </div>
            </>
          )
        ) : (
          <>
            <div className="nav-item" onClick={() => handleLinkClick('/book')}>
              <NavLink to="/book" activeClassName="active-link">Book Appointments</NavLink>
            </div>
            <div className="nav-item" onClick={() => handleLinkClick('/pricing')}>
              <NavLink to="/pricing" activeClassName="active-link">See Pricing</NavLink>
            </div>
          </>
        )}
      </nav>
      <div className={`login ${user && user.role === 'doctor' ? 'doctor-logged-in' : ''}`}>
        {user ? (
          <div className="user-profile" onClick={() => setDropdownOpen(!isDropdownOpen)} style={{ cursor: 'pointer' }}>
            {user.name}
            {isDropdownOpen && (
              <div className="dropdown" ref={dropdownRef}>
                {user.role === 'doctor' && (
                  <div className="dropdown-item" onClick={() => handleLinkClick('/doctorprofile')}>
                    <NavLink to="/doctorprofile" style={{ textDecoration: 'none', color: 'inherit' }}>View Profile</NavLink>
                  </div>
                )}
                {user.role !== 'doctor' && (
                  <div className="dropdown-item" onClick={() => handleLinkClick('/userappointments')}>
                    <NavLink to="/userappointments" style={{ textDecoration: 'none', color: 'inherit' }}>View Appointments</NavLink>
                  </div>
                )}
                <div className="dropdown-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</div>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/login" activeClassName="active-link">Login</NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
