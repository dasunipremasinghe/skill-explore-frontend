import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

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
  topics: Topic[];
  archived: boolean;
  userId?: string;
};

const ExplorePlansPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRandomPlans = async () => {
    try {
      const email = encodeURIComponent(user?.email || "");
      const res = await apiFetch<LearningPlan[]>(`/learning-plans/random?excludeUserId=${email}`);
      setResults(res);
    } catch (err) {
      console.error("Failed to load random plans", err);
    }
  };

  useEffect(() => {
    fetchRandomPlans();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch<LearningPlan[]>(`/learning-plans/search?q=${query}`);
      setResults(res);
    } catch (err) {
      console.error("Search failed", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async (plan: LearningPlan) => {
    if (!user) {
      alert("You must be logged in to save a plan.");
      return;
    }

    try {
      await apiFetch(`/learning-plans/${plan.id}`); // check if exists
    } catch (err) {
      alert("❌ This plan no longer exists or was deleted.");
      return;
    }

    const progressEntry = {
      userId: user.email,
      learningPlanId: plan.id,
      topicProgressList: plan.topics.map((topic) => ({
        topicName: topic.title,
        completed: false,
        resourceProgressList: topic.resources.map((resource) => ({
          resourceName: resource.name,
          completed: false,
        })),
      })),
    };

    try {
      await apiFetch("/user-progress", {
        method: "POST",
        body: JSON.stringify(progressEntry),
      });
      alert("✅ Plan saved to your learning plans!");
    } catch (err) {
      console.error("Save failed", err);
      alert("Something went wrong while saving.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2>🌟 Explore Public Learning Plans</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/profile")}>👤 Go to Profile</button>
      </div>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or topic"
        />
        <button type="submit" className="btn">🔍 Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No learning plans found.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
          {results.map((plan) => (
            <div key={plan.id} className="media-card" style={{ width: "300px", padding: "1rem" }}>
              <h3>{plan.title}</h3>
              <p>{plan.description}</p>
              <p><strong>📚 Topics:</strong></p>
              <ul>
                {plan.topics.map((t) => (
                  <li key={t.title}>{t.title}</li>
                ))}
              </ul>
              <p>
                ⏳ <strong>
                  Estimated Total Time:
                  {" "}
                  {plan.topics.reduce((sum, t) =>
                    sum + t.resources.reduce((rSum, r) => rSum + r.estimatedTimeHours, 0), 0)
                  } hours
                </strong>
              </p>
              <p><em>Created by: {plan.userId}</em></p>
              <button className="btn btn-primary" onClick={() => handleSavePlan(plan)}>
                💾 Save to My Plans
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePlansPage;
