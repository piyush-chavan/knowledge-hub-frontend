import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3030';
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Register failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
        toast.success('Registration successful!');
      } else {
        toast.error('Registration failed. Please try again.');
        throw new Error('No token returned by API');
      }
    } catch (err) {
      setError(err.message);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card" style={{maxWidth:'500px'}}>
        <h2>Register</h2>
        <form onSubmit={submit}>
          <div className="floating-group" >
            <input
              id="register-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder=" "
              className="floating-input"
            />
            <label htmlFor="register-username" className="floating-label">Username</label>
          </div>

          <div className="floating-group">
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=""
              className="floating-input"
            />
            <label  className="floating-label">Password</label>
          </div>
          <br /> 
          <button type="submit" disabled={loading}>
            {loading ? 'Registering…' : 'Register'}
          </button>

          {error && <p className="error">Error: {error}</p>}
        </form>

        
      </div>
    </div>
  );
}
