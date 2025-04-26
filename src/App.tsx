import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import DashboardLayout from './layout/DashboardLayout';
import HomePage from './Pages/HomePage';
import Profile from './Pages/ProfilePage';
import CreateStructuredLearningPlanForm from './Pages/CreateStructuredLearningPlanForm';
import EditLearningPlanForm from "./Pages/EditLearningPlanForm";
import LearningPlansPage from "./Pages/LearningPlansPage";
import ExplorePlansPage from "./Pages/ExplorePlansPage";

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="530084173352-5fogci91qubm2ooarqbaab43ohr7u7g1.apps.googleusercontent.com">
      <Router>
        <Routes>
          {/* HomePage directly (without DashboardLayout) */}
          <Route path="/" element={<HomePage />} />

          {/* Routes that should have the sidebar (DashboardLayout) */}
          <Route path="/plans" element={
            <DashboardLayout>
              <LearningPlansPage />
            </DashboardLayout>
          } />

          <Route path="/profile" element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          } />

          <Route path="/explore" element={
            <DashboardLayout>
              <ExplorePlansPage />
            </DashboardLayout>
          } />

          <Route path="/plans/create" element={
            <DashboardLayout>
              <CreateStructuredLearningPlanForm />
            </DashboardLayout>
          } />

          <Route path="/plans/edit/:id" element={
            <DashboardLayout>
              <EditLearningPlanForm />
            </DashboardLayout>
          } />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
