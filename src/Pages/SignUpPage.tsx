import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/SignUp.css'; 

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [picture, setPicture] = useState('');

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert("All fields are required except profile picture");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const newUser = {
      firstName,
      lastName,
      email,
      password,
      picture,
      authProvider: "local"
    };

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        alert("Signup successful! Please log in.");
        navigate('/login');
      } else {
        const errData = await response.json();
        alert(`Signup failed: ${errData.message}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong during signup");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        className="signup-input"
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        className="signup-input"
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        className="signup-input"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        className="signup-input"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        className="signup-input"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Profile Picture URL (optional)"
        value={picture}
        className="signup-input"
        onChange={(e) => setPicture(e.target.value)}
      />
      <button className="signup-button" onClick={handleSignUp}>
        Sign Up
      </button>
      <p className="signup-link">
        Already have an account?{" "}
        <span onClick={() => navigate('/')}>Login here</span>
      </p>
    </div>
  );
};

export default SignUpPage;
