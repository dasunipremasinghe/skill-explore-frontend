import React, { useState } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../auth/AuthContext";

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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(false);

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
  
    // 🛑 Check if the plan still exists on backend
    try {
      await apiFetch(`/learning-plans/${plan.id}`);
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
      alert("Failed to save plan.");
    }
  };
  
  

  const calculateTotalHours = (plan: LearningPlan) => {
    return plan.topics.reduce((total, topic) => {
      return total + topic.resources.reduce((sum, resource) => sum + (resource.estimatedTimeHours || 0), 0);
    }, 0);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>🌟 Explore Public Learning Plans</h2>

      <form onSubmit={handleSearch} style={{ textAlign: "center", marginBottom: "2rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by topic, title, or description..."
          style={{ padding: "0.8rem", width: "300px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            marginLeft: "1rem",
            padding: "0.8rem 1.5rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          🔎 Search
        </button>
      </form>

      {loading && <p style={{ textAlign: "center" }}>Loading results...</p>}
      {!loading && results.length === 0 && <p style={{ textAlign: "center" }}>No results found.</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center" }}>
        {results.map((plan) => (
          <div key={plan.id} style={{
            border: "1px solid #ccc",
            padding: "1.5rem",
            borderRadius: "12px",
            width: "300px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s",
            backgroundColor: "#fff"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3 style={{ marginBottom: "0.5rem" }}>{plan.title}</h3>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>{plan.description}</p>

            <p style={{ marginTop: "1rem", fontWeight: "bold" }}>📚 Topics:</p>
            <ul style={{ fontSize: "0.85rem" }}>
              {plan.topics.map((topic, idx) => (
                <li key={idx}>📝 {topic.title}</li>
              ))}
            </ul>

            <p style={{ marginTop: "1rem", fontWeight: "bold" }}>⏳ Estimated Total Time: {calculateTotalHours(plan)} hours</p>

            <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
              <strong>Created by:</strong> {plan.userId || "Unknown"}
            </p>

            <button
              onClick={() => handleSavePlan(plan)}
              style={{
                marginTop: "1rem",
                backgroundColor: "#007bff",
                color: "white",
                padding: "0.7rem 1.2rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%"
              }}
            >
              💾 Save to My Plans
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePlansPage;
