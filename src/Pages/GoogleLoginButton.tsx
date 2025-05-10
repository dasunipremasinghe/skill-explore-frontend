import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import '../CSS/GoogleLoginButton.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleNormalLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      localStorage.setItem("user_id", data.userId);
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_name", `${data.firstName} ${data.lastName}`);
      navigate('/profile');
    } catch (err) {
  console.error("Login error:", err);
  const errorMessage = err instanceof Error ? err.message : "Unexpected login error";
  alert(`Login failed: ${errorMessage}`);
}
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    if (!token) return;

    fetch("http://localhost:8080/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(data => {
        localStorage.setItem("google_token", token);
        localStorage.setItem("user_name", `${data.firstName} ${data.lastName}`);
        localStorage.setItem("user_email", data.email);
        localStorage.setItem("user_id", data.userId);
        navigate('/profile');
      })
      .catch(err => {
        console.error("Google login failed:", err.message || err);
        alert("Google Login Failed: " + (err.message || "Unexpected error"));
      });
  };

  return (
    <div className="auth-page-wrapper">
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
            onError={() => alert('Google Login Failed')}
          />
        </div>

        <p className="signup-link">
          Don't have an account?{" "}
          <span onClick={() => navigate('/signup')}>Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
