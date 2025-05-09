import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

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

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
