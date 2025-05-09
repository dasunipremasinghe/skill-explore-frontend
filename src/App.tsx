import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./Pages/HomePage";
import ProfilePage from "./Pages/ProfilePage";
import LearningPlansPage from "./Pages/LearningPlansPage";
import EditLearningPlanForm from "./Pages/EditLearningPlanForm";
import ExplorePlansPage from "./Pages/ExplorePlansPage";
import CreateStructuredLearningPlanForm from "./Pages/CreateStructuredLearningPlanForm";
import ProgressTracker from "./Pages/ProgressTracker";
import ViewLearningPlanPage from "./Pages/ViewLearningPlanPage";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { GoogleOAuthProvider } from "@react-oauth/google";


const AppContent: React.FC = () => {
  const { user } = useAuth();

  const currentUser = {
    id: user?.email || "guest",
    name: user?.name || "Guest",
    avatar: user?.picture || "/default-avatar.png" // ✅ fixed
  };

  return (
    <>
      <Header currentUser={currentUser} />
      <div style={{ paddingTop: "70px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/plans" element={<LearningPlansPage />} />
          <Route path="/plans/edit/:id" element={<EditLearningPlanForm />} />
          <Route path="/explore" element={<ExplorePlansPage />} />
          <Route path="/create" element={<CreateStructuredLearningPlanForm />} />
          <Route path="plans/create" element={<CreateStructuredLearningPlanForm />} />
          <Route path="/progress" element={<ProgressTracker learningPlanId="example-id" />} />
          <Route path="/plans/view/:id" element={<ViewLearningPlanPage />} />

        </Routes>
      </div>
    </>
  );
};

const App: React.FC = () => (
  <GoogleOAuthProvider clientId="530084173352-5fogci91qubm2ooarqbaab43ohr7u7g1.apps.googleusercontent.com">
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppContent />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);

export default App;
