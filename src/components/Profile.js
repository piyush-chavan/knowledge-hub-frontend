import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import { toast } from 'react-toastify';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const fetchedRef = useRef(false);

  const navigate = useNavigate();
  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3030';
      const response = await fetch(`${backendUrl}/user/profile`, {
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
  useEffect(() => {
    if (!token || fetchedRef.current) return;
    fetchedRef.current = true;
    fetchProfile();
  }, [token]);

  // update container code here all functions and states
  const [showEdit, setShowEdit] = useState(false);

  const [formData, setFormData] = useState({
    name: profile?.userDetails.name || "",
    username: profile?.userDetails.username || "",
    email: profile?.userDetails.email || "",
    education: profile?.userDetails.education || "",
    bio: profile?.userDetails.bio || "",
  });

  useEffect(() => {
    setFormData({
      name: profile?.userDetails.name || "",
      username: profile?.userDetails.username || "",
      email: profile?.userDetails.email || "",
      education: profile?.userDetails.education || "",
      bio: profile?.userDetails.bio || "",
    });
  }, [profile])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    const confirmUpdate = window.confirm("Are you sure you want to update profile?");
    if (!confirmUpdate) return;

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3030';
      const res = await fetch(`${backendUrl}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      toast.success("Profile updated successfully");
      setShowEdit(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

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
        {loading &&
          <div className="loading">
            <HashLoader color="#007bff" />
          </div>}
        {/* {loading && <p className="loading">Loading...</p>} */}

        {error && <p className="error">Error: {error}</p>}
        {profile && (
          <div className="profile-data">
            {/* <pre>{JSON.stringify(profile, null, 2)}</pre> */}


            {showEdit && (
              <div className="profile-edit-container">
                <div className="edit-form">
                  <h3>Edit Profile</h3>
                  <i style={{ cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }} onClick={() => setShowEdit(false)} class="fa-solid fa-circle-xmark"></i>

                  <div className="floating-group">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className="floating-input"
                    />
                    <label className="floating-label">Name</label>
                  </div>

                  <div className="floating-group">
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      className="floating-input"
                    />
                    <label className="floating-label">Username</label>
                  </div>

                  <div className="floating-group">
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="floating-input"
                    />
                    <label className="floating-label">Email</label>
                  </div>

                  <div className="floating-group">
                    <input
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="Education"
                      className="floating-input"
                    />
                    <label className="floating-label">Education</label>
                  </div>
                  <div className="floating-group">
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Bio"
                      className="floating-input"
                    />
                    <label className="floating-label">Bio</label>
                  </div>

                  <button className="save-btn" onClick={handleUpdate}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            <div className="profile-container">

              <div className="profile-card">
                <span className="edit-btn" onClick={() => setShowEdit(!showEdit)}>
                  {showEdit ? <></> : <><i class="fa-solid fa-pen-to-square"></i></>}
                </span>
                <span className="profile-avatar">{profile.userDetails.name.charAt(0).toUpperCase()}</span>
                <h2 className="profile-name">{profile.userDetails.name}</h2>
                <p className="profile-username">@{profile.userDetails.username}</p>

                <p className="profile-bio">{profile.userDetails.bio}</p>

                <div className="profile-info">
                  <p>📧Email :  {profile.userDetails.email}</p>
                  <p>🎓Education: {profile.userDetails.education}</p>
                  <p>📅 Joined: {new Date(profile.userDetails.joinedOn).toDateString()}</p>
                </div>

                {/* Stats */}
                <div className="profile-stats">
                  <div className="stat-box">
                    <h3>{profile.questionsAsked.length}</h3>
                    <p>Questions Asked</p>
                  </div>

                  <div className="stat-box">
                    <h3>{profile.answersGiven.length}</h3>
                    <p>Answers Given</p>
                  </div>

                  <div className="stat-box">
                    <h3>{profile.questionsAsked.length + profile.answersGiven.length}</h3>
                    <p>Total</p>
                  </div>
                </div>
              </div>
            </div>





            <div className="qa-container">

              {/* Questions */}
              <div className="qa-section">
                <h3 className="qa-heading">Questions Asked</h3>

                {profile.questionsAsked.length === 0 && (
                  <p className="qa-empty">No questions yet</p>
                )}

                {profile.questionsAsked.map((q) => (
                  <div className="qa-card" key={q._id}>
                    <h4 className="qa-title">{q.title}</h4>

                    <button
                      className="qa-btn"
                      onClick={() => navigate(`/question/${q._id}`)}
                    >
                      View Question →
                    </button>
                  </div>
                ))}
              </div>

              {/* Answers */}
              <div className="qa-section">
                <h3 className="qa-heading">Answers Given</h3>

                {profile.answersGiven.map((a) => (
                  <div className="qa-card" key={a._id}>
                    <h4 className="qa-title">{a.question.title}</h4>

                    <p className="qa-answer">
                      {a.body.slice(0, 120)}...
                    </p>

                    <button
                      className="qa-btn"
                      onClick={() => navigate(`/question/${a.question._id}`)}
                    >
                      View Question →
                    </button>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}