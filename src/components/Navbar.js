import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="app-navbar">
      <div className="app-nav-brand">
        <img alt='app-icon' src={require('../logos/kHubBulb.png')} style={{height:'40px',margin:'0 5px'}} />
        <div>Knowledge Hub</div>
      </div>
      <button className="app-nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
        {menuOpen ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-bars"></i>}
      </button>
      <div className={`app-nav-links ${menuOpen ? 'mobile-open' : ''}`}>
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMenuOpen(false)}>
          <i class="fa-solid fa-house"></i> Home
        </NavLink>
        <NavLink to="/questions" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMenuOpen(false)}>
          <i class="fa-solid fa-clipboard-list"></i> Questions
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMenuOpen(false)}>
          <i class="fa-solid fa-users"></i> Users
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMenuOpen(false)}>
          <i class="fa-solid fa-circle-info"></i> About
        </NavLink>
        {!token && (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMenuOpen(false)}>
              Login
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMenuOpen(false)}>
              Register
            </NavLink>
          </>
        )}
        <NavLink to="/user/profile" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMenuOpen(false)}>
          <i class="fa-solid fa-circle-user"></i> Profile
        </NavLink>
      </div>
    </nav>
  );
}
