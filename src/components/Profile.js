import React, { useEffect, useState, useRef } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!token || fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('https://knowledge-hub-backend-8ela.onrender.com/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (!token) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Profile</h2>
          <p className="notice">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="card">
        <h2>Your Profile</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error">Error: {error}</p>}
        {profile && (
          <div className="profile-data">
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}