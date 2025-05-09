import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { useAuth } from "../auth/AuthContext";
import StructuredProgressTracker from "./StructuredProgressTracker";

type Resource = {
  name: string;
  url: string;
  estimatedTimeHours: number;
};

type Topic = {
  title: string;
  resources: Resource[];
};

type LearningPlan = {
  id: string;
  title: string;
  description: string;
  userId: string;
  topics: Topic[];
};

const ViewLearningPlanPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await apiFetch<LearningPlan>(`/learning-plans/${id}`);
        setPlan(data);
      } catch (err) {
        console.error("Failed to fetch learning plan:", err);
        alert("Could not load the plan.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPlan();
  }, [id]);

  if (loading || !plan) return <div style={{ padding: "2rem" }}>Loading plan...</div>;

  const isCreator = user?.email === plan.userId;

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "2rem" }}>
      <h2 style={{ color: "#1877f2" }}>{plan.title}</h2>
      <p style={{ fontSize: "16px", marginBottom: "1rem", color: "#555" }}>{plan.description}</p>

      {isCreator && (
        <button
          onClick={() => navigate(`/plans/edit/${plan.id}`)}
          style={{
            padding: "8px 12px",
            backgroundColor: "#1877f2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "2rem"
          }}
        >
          ✏️ Edit Plan
        </button>
      )}

      <h3>Topics & Resources</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {plan.topics.map((topic, idx) => (
          <li key={idx} style={{ marginBottom: "1.5rem" }}>
            <strong style={{ fontSize: "16px", color: "#2c3e50" }}>{topic.title}</strong>
            <ul style={{ marginLeft: "1rem" }}>
              {topic.resources.map((res, i) => (
                <li key={i}>
                  <a href={res.url} target="_blank" rel="noopener noreferrer">
                    {res.name}
                  </a>{" "}
                  ({res.estimatedTimeHours} hrs)
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <hr style={{ margin: "2rem 0" }} />

      <StructuredProgressTracker learningPlanId={plan.id} />

<div style={{ marginTop: "2rem" }}>
  <button
    onClick={() => navigate("/profile")}
    style={{
      padding: "10px 16px",
      backgroundColor: "#2ecc71",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px"
    }}
  >
    ✅ Save & Back to Profile
  </button>
</div>

    </div>
  );
};

export default ViewLearningPlanPage;
