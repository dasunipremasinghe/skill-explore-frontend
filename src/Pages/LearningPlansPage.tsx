import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

type LearningPlan = {
  id: string;
  title: string;
  description: string;
  userId: string;
  archived: boolean;
};

const LearningPlansPage: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const navigate = useNavigate();

  const fetchPlans = async () => {
    if (user) {
      const response = await apiFetch<LearningPlan[]>(`/learning-plans/user/${user.email}`);
      setPlans(response.filter(plan => !plan.archived));
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [user]);

  const handleEdit = (id: string) => {
    navigate(`/plans/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/learning-plans/${id}`, { method: "DELETE" });
      fetchPlans();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete plan.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ color: "#1877f2" }}>My Learning Plans</h2>
        <button
          onClick={() => navigate("/create")}
          style={{
            padding: "10px 16px",
            backgroundColor: "#1877f2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          ➕ Create New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <p>You haven't created any plans yet.</p>
      ) : (
        plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              padding: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem", color: "#333" }}>{plan.title}</h3>
            <p style={{ marginBottom: "1rem", color: "#555" }}>
              {plan.description.length > 150
                ? plan.description.slice(0, 150) + "..."
                : plan.description}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                onClick={() => handleEdit(plan.id)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#1877f2",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => handleDelete(plan.id)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#d9534f",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LearningPlansPage;
