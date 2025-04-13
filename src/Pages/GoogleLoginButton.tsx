import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; 
import '../CSS/GoogleLoginButton.css';

const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    console.log("Received Google token:", token); //Add this
  
    if (!token) {
      console.error("No token received from Google");
      return;
    }
  
    fetch("http://localhost:8080/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      mode: "cors", //Always include this when talking to a different port
    })
      .then(res => {
        console.log("🔁 Response status:", res.status);
        return res.json();
      })
      .then(data => {
        console.log("User Info:", data);

      const fullName = `${data.firstName} ${data.lastName}`;
      localStorage.setItem("google_token", token);
      localStorage.setItem("user_name", fullName);
      localStorage.setItem("user_email", data.email);
        navigate('/profile');
      })
      .catch(err => {
        console.error("Login failed:", err.message || err);
      });
  };
  

  return (
    <div className="google-login-container">
      <GoogleLogin
  onSuccess={handleSuccess}
  onError={() => console.log('Login Failed')}
/>
    </div>
  );
};

export default GoogleLoginButton;
