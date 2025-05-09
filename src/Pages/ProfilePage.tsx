import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiFetch } from "../api/api";
import "../CSS/Profile.css";

interface LearningPlan {
  id: string;
  title: string;
  description: string;
  archived: boolean;
  userId: string;
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await apiFetch(`/learning-plans/${id}`, { method: "DELETE" });
      setPlans(plans.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete plan.");
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchPlans();
    }
  }, [user]);

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
        <h3>Your Learning Plans</h3>
        {loading ? (
          <p>Loading your plans...</p>
        ) : plans.length === 0 ? (
          <p>You haven't created any plans yet.</p>
        ) : (
          <div className="grid-gallery">
            {plans.map((plan) => (
              <div key={plan.id} className="media-card">
                <h4>{plan.title}</h4>
                <p>{plan.description.length > 100 ? plan.description.slice(0, 100) + "..." : plan.description}</p>
                <div className="profile-buttons">
                  <button className="btn" onClick={() => navigate(`/plans/edit/${plan.id}`)}>✏️ Edit</button>
                  <button className="btn btn-secondary" onClick={() => handleDelete(plan.id)}>🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
