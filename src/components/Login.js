import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
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
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
        toast.success('Login successful!');
      } else {
        toast.error('Login failed. Please check your credentials.');
        throw new Error('No token returned by API');
      }
    } catch (err) {
      setError(err.message);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card" style={{maxWidth:'500px'}}>
        <h2>Login</h2>
        <form onSubmit={submit}>
          <div className="floating-group">
            <input
              id="login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder=""
              className="floating-input"
            />
            <label htmlFor="login-username" className="floating-label">Username</label>
          </div>

          <div className="floating-group">
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=""
              className="floating-input"
            />
            <label htmlFor="login-password" className="floating-label">Password</label>
          </div>
          <br />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>

          {error && <p className="error">Error: {error}</p>}
        </form>

        
      </div>
    </div>
  );
}
