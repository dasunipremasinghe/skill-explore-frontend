import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignUpPage from './Pages/SignUpPage';
import LoginPage from './Pages/LoginPage';
import Profile from './Pages/ProfilePage';
import UploadMedia from './Pages/UploadMediaPage';
import HomePage from './Pages/HomePage';

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="530084173352-5fogci91qubm2ooarqbaab43ohr7u7g1.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<UploadMedia />} />
          <Route path="/home" element={<HomePage />} />
          {/* default fallback: redirect "/" to /home or /login as needed */}
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
