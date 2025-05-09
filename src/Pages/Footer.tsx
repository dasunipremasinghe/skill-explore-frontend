import React from 'react';
import '../CSS/Footer.css';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>&copy; 2025 Skill Explorer | All rights reserved.</p>
        </div>
        <div className="footer-right">
          <p>Follow us: </p>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> | 
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a> | 
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
