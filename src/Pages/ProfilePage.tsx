import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiFetch } from "../api/api";
import "../CSS/Profile.css";

interface Resource {
  name: string;
  url: string;
  estimatedTimeHours: number;
}

interface Topic {
  title: string;
  resources: Resource[];
}

interface LearningPlan {
  id: string;
  title: string;
  description: string;
  archived: boolean;
  userId: string;
  topics: Topic[];
}

interface UserLearningProgress {
  learningPlanId: string;
  topicProgressList: {
    topicName: string;
    completed: boolean;
    resourceProgressList: {
      resourceName: string;
      completed: boolean;
    }[];
  }[];
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [savedProgress, setSavedProgress] = useState<UserLearningProgress[]>([]);
  const [savedPlans, setSavedPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setUserReady(true);
      fetchPlans();
      fetchSavedProgress();
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      const res = await apiFetch<LearningPlan[]>(`/learning-plans/user/${user?.email}`);
      setPlans(res.filter(plan => !plan.archived));
    } catch (err) {
      console.error("Error loading plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedProgress = async () => {
    try {
      const res = await apiFetch<UserLearningProgress[]>(`/user-progress/${user?.email}`);
      setSavedProgress(res);
  
      const planIds = res.map(p => p.learningPlanId);
  
      // Use Promise.allSettled to avoid 404 crashing everything
      const results = await Promise.allSettled(
        planIds.map(id => apiFetch<LearningPlan>(`/learning-plans/${id}`))
      );
  
      const validPlans = results
        .filter(r => r.status === "fulfilled")
        .map(r => (r as PromiseFulfilledResult<LearningPlan>).value);
  
      setSavedPlans(validPlans.filter(plan => plan.userId !== user?.email));
    } catch (err) {
      console.error("Error loading saved plans:", err);
    }
  };
  

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await apiFetch(`/learning-plans/${id}`, { method: "DELETE" });
      setPlans(plans.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete plan.");
    }
  };

  const handleUnsavePlan = async (planId: string) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      const progress = savedProgress.find(p => p.learningPlanId === planId);
      if (!progress) return;
      await apiFetch(`/user-progress/${user?.email}/${planId}`, {
        method: "DELETE"
      });
      setSavedPlans(savedPlans.filter(p => p.id !== planId));
    } catch (err) {
      alert("Failed to unsave plan.");
    }
  };

  const getCompletionPercent = (planId: string): number => {
    const progress = savedProgress.find(p => p.learningPlanId === planId);
    if (!progress) return 0;
    const total = progress.topicProgressList.reduce(
      (sum, topic) => sum + topic.resourceProgressList.length,
      0
    );
    const done = progress.topicProgressList.reduce(
      (sum, topic) => sum + topic.resourceProgressList.filter(r => r.completed).length,
      0
    );
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  if (!userReady) {
    return <div style={{ padding: "2rem" }}>Loading profile...</div>;
  }

  return (
    <div className="profile-layout">
      {/* Sidebar */}
      <aside className="profile-sidebar">
        <img src={user?.picture || "/default-avatar.png"} alt="Profile" className="profile-photo" />
        <h2 className="profile-name">{user?.name || "Guest"}</h2>
        <p className="profile-email">{user?.email}</p>

        <div className="profile-actions">
          <button className="btn" onClick={() => navigate("/create")}>➕ Create New Plan</button>
          <button className="btn">Edit Profile</button>
          <button className="btn btn-secondary" onClick={logout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="profile-content">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Your Learning Plans</h3>
        <button className="btn btn-secondary" onClick={() => navigate("/explore")}>🌍 Explore More Plans</button>
      </div>

        <h3>Your Learning Plans</h3>
        {loading ? (
          <p>Loading your plans...</p>
        ) : plans.length === 0 ? (
          <p>You haven't created any plans yet.</p>
        ) : (
          <div className="grid-gallery">
            {plans.map((plan) => {
              const isCreator = user?.email === plan.userId;
              return (
                <div
                  key={plan.id}
                  className="media-card"
                  onClick={() => navigate(`/plans/view/${plan.id}`)}
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  <h4>{plan.title}</h4>
                  <p>{plan.description.length > 100 ? plan.description.slice(0, 100) + "..." : plan.description}</p>

                  {isCreator && (
                    <div className="profile-buttons">
                      <button
                        className="btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/plans/edit/${plan.id}`);
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(plan.id);
                        }}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <h3 style={{ marginTop: "3rem" }}>Saved Learning Plans</h3>
        {savedPlans.length === 0 ? (
          <p>You haven't saved any plans yet.</p>
        ) : (
          <div className="grid-gallery">
            {savedPlans.map((plan) => {
              const progress = savedProgress.find(p => p.learningPlanId === plan.id);
              return (
                <div
                  key={plan.id}
                  className="media-card"
                  onClick={() => navigate(`/plans/view/${plan.id}`)}
                  style={{
                    cursor: "pointer",
                    opacity: 0.95,
                    position: "relative",
                    border: "1px dashed #aaa"
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "#ffeaa7",
                      color: "#2c3e50",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    ⭐ Saved
                  </span>

                  <h4>{plan.title}</h4>
                  <p>{plan.description.length > 100 ? plan.description.slice(0, 100) + "..." : plan.description}</p>
                  <p style={{ color: "#2c3e50", marginTop: "0.5rem" }}>
                    📊 {progress ? getCompletionPercent(plan.id) : 0}% completed
                  </p>

                  <div className="profile-buttons">
                    <button
                      className="btn btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsavePlan(plan.id);
                      }}
                    >
                      ❌ Unsave
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
