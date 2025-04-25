import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignUpPage from './Pages/SignUpPage';
import HomePage from './Pages/HomePage';
import Profile from './Pages/ProfilePage';
import UploadMedia from './Pages/UploadMediaPage';

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="530084173352-5fogci91qubm2ooarqbaab43ohr7u7g1.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/upload" element={<UploadMedia />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
