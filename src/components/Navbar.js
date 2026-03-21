import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const token = localStorage.getItem('token');

  return (
    <nav className="app-navbar">
      <div className="app-nav-brand">
        <img src={require('../logos/kHubBulb.png')} style={{height:'40px',margin:'0 5px'}} />
      <div>Knowledge Hub</div>
      </div>
      <div className="app-nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
          About
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')}>
          Users
        </NavLink>
        <NavLink to="/questions" className={({ isActive }) => (isActive ? 'active' : '')}>
          Questions
        </NavLink>
        {!token && (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
              Login
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
              Register
            </NavLink>
          </>
        )}
        <NavLink to="/user/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
          Profile
        </NavLink>
      </div>
    </nav>
  );
}
