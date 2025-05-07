import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import '../CSS/GoogleLoginButton.css';


const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNormalLogin = () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Login success:", data);
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_name", `${data.firstName} ${data.lastName}`);
        localStorage.setItem("user_email", data.email);
        localStorage.setItem("user_id", data.userId);
        navigate('/profile');
      })
      .catch(err => {
        console.error("Login error:", err);
        alert("Login failed. Please check your credentials.");
      });
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    if (!token) {
      console.error("No token received from Google");
      return;
    }
  
    fetch("http://localhost:8080/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }), 
      mode: "cors",
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText);
        }
        return res.json();
      })
      .then(data => {
        const fullName = `${data.firstName} ${data.lastName}`;
        localStorage.setItem("google_token", token);
        localStorage.setItem("user_name", fullName);
        localStorage.setItem("user_email", data.email);
        localStorage.setItem("user_id", data.userId);
        navigate('/profile');
      })
      .catch(err => {
        console.error("Login failed:", err.message || err);
        alert("Login failed: " + (err.message || "Something went wrong during Google authentication"));
      });
  };

  return (
    <div className="google-login-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        className="auth-input"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        className="auth-input"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="auth-button" onClick={handleNormalLogin}>
        Login
      </button>

      <p className="separator">or</p>

      <div className="google-button">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.log('Google Login Failed');
            alert('Google Login Failed');
          }}
        />
      </div>

      <p className="signup-link">
        Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
      </p>
    </div>
  );
};

export default GoogleLoginButton;
