import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

export default function UserProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileTab, setProfileTab] = useState('questions');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3030';
        const response = await fetch(`${backendUrl}/user/profile/${username}`, {
          method: 'GET',
          headers: {
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
  }, [username]);

  return (
    <div className="page-container">
      <div className="card">
        <h2>Profile of {username}</h2>
        {loading &&
          <div className="loading">
            <HashLoader color="#007bff" />
          </div>}
        {/* {loading && <p className="loading">Loading profile...</p>} */}


        {error && <p className="error">Error: {error}</p>}
        {!loading && !error && profile && (
          <div className="profile-data">
            {/* <pre>{JSON.stringify(profile, null, 2)}</pre> */}
            <div className="profile-container">
              <div className="profile-card">
                <span className="profile-avatar">{profile.userDetails?.name.charAt(0).toUpperCase()}</span>
                <h2 className="profile-name">{profile.userDetails?.name}</h2>
                <p className="profile-username">@{profile.userDetails?.username}</p>

                <p className="profile-bio">{profile.userDetails?.bio}</p>

                <div className="profile-info">
                  <p>📧Email: {profile.userDetails?.email}</p>
                  <p>🎓Education: {profile.userDetails?.education}</p>
                  <p>📅 Joined: {new Date(profile.userDetails?.joinedOn).toDateString()}</p>
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
            <div style={{ flex: 3, minWidth: 'min(600px,100%)' }}>
              <div className="profile-tabs">
                <button
                  className={`tab-btn ${profileTab === "questions" ? "active" : ""}`}
                  onClick={() => setProfileTab("questions")}
                >
                  Questions
                </button>

                <button
                  className={`tab-btn ${profileTab === "answers" ? "active" : ""}`}
                  onClick={() => setProfileTab("answers")}
                >
                  Answers
                </button>
              </div>

              <div className="qa-container">

                {/* Questions */}
                {profileTab === 'questions' && (<div className="qa-section">
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
                </div>)}

                {/* Answers */}
                {profileTab === 'answers' && (<div className="qa-section">
                  <h3 className="qa-heading">Answers Given</h3>

                  {profile.answersGiven.map((a) => (
                    <div className="qa-card" key={a._id}>
                      <h4 className="qa-title">{a.question?.title}</h4>

                      <p className="qa-answer">
                        {a.body.slice(0, 120)}...
                      </p>

                      <button
                        className="qa-btn"
                        onClick={() => navigate(`/question/${a.question?._id}`)}
                      >
                        View Question →
                      </button>
                    </div>
                  ))}
                </div>)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}