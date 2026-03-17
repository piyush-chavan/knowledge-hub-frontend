import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-card">

        <h1 className="about-title">Knowledge Hub (Mini Quora)</h1>
        <p className="about-subtitle">Ask. Answer. Learn.</p>

        <section className="about-section">
          <h2>About the Project</h2>
          <p>
            Mini Quora is a full-stack web application inspired by Quora,
            where users can ask questions, share knowledge, and interact
            with a community. It provides a platform for meaningful
            discussions and knowledge sharing.
          </p>
        </section>

        <section className="about-section">
          <h2>Features</h2>
          <ul>
            <li>Ask and answer questions</li>
            <li>User authentication (login/signup)</li>
            <li>View all questions and answers</li>
            <li>Clean and responsive UI</li>
            <li>REST API with Express backend</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Tech Stack</h2>
          <ul>
            <li>Frontend: React.js</li>
            <li>Backend: Node.js + Express.js</li>
            <li>Database: MongoDB Atlas</li>
            <li>Authentication: JWT</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Developer</h2>
          <p>
            This project is developed by <strong>Piyush Chavan</strong>, 
            a passionate full-stack developer focused on building scalable 
            and modern web applications.
          </p>
        </section>

        <footer className="about-footer">
          <p>© {new Date().getFullYear()} Piyush Chavan. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
};

export default About;