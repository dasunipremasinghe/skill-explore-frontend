import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LearningPlansPage from "./Pages/LearningPlansPage";

import HomePage from './Pages/HomePage';
import Profile from './Pages/ProfilePage';
import CreateLearningPlanForm from "./Pages/CreateLearningPlanForm";
import EditLearningPlanForm from "./Pages/EditLearningPlanForm";
const App: React.FC = () => {
  return (
    
    <GoogleOAuthProvider clientId="530084173352-5fogci91qubm2ooarqbaab43ohr7u7g1.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plans" element={<LearningPlansPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/plans/create" element={<CreateLearningPlanForm />} />
          <Route path="/plans/edit/:id" element={<EditLearningPlanForm />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
   
  );
};

export default App;
