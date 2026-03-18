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
      const response = await fetch('https://knowledge-hub-backend-8ela.onrender.com/auth/login', {
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
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={submit}>
          <div>
            <label htmlFor="login-username">Username:</label>
            <input
              id="login-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="login-password">Password:</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
