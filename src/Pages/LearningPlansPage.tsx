import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

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
};

const LearningPlansPage: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;

    apiFetch<LearningPlan[]>(`/learning-plans/user/${user.email}`)
      .then(setPlans)
      .catch((err) => console.error("Failed to fetch plans:", err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this plan?");
    if (!confirmDelete) return;

    try {
      await apiFetch(`/learning-plans/${id}`, { method: "DELETE" });
      setPlans(plans.filter(plan => plan.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete plan.");
    }
  };

  const handleArchiveToggle = async (id: string) => {
    try {
      const updatedPlan = await apiFetch<LearningPlan>(`/learning-plans/archive/${id}`, {
        method: "PUT"
      });
      setPlans(plans.map(plan => plan.id === id ? updatedPlan : plan));
    } catch (err) {
      console.error("Archive toggle failed", err);
      alert("Failed to update archive status.");
    }
  };

  const filteredPlans = plans.filter(plan =>
    plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.topics.some(topic => topic.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <p>Loading plans...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Your Learning Plans</h2>

      <div style={{ marginBottom: "1rem" }}>
        <Link to="/plans/create">
          <button style={{ padding: "0.5rem 1rem", fontWeight: "bold" }}>➕ Create New Plan</button>
        </Link>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search plans by title, topic, or description"
          style={{ padding: "0.5rem", width: "100%", maxWidth: "400px" }}
        />
      </div>

      {filteredPlans.length === 0 ? (
        <p>No learning plans found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredPlans.map((plan) => (
            <li key={plan.id} style={{ marginBottom: "2rem", border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
              <h3>{plan.title}</h3>
              <p>{plan.description}</p>
              <p>Status: {plan.archived ? "Archived" : "Active"}</p>

              {/* List Topics */}
              {plan.topics.length > 0 && (
                <div>
                  <h4>Topics:</h4>
                  <ul>
                    {plan.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} style={{ marginBottom: "1rem" }}>
                        <strong>{topic.title}</strong>

                        {/* List Resources */}
                        {topic.resources.length > 0 && (
                          <ul style={{ marginLeft: "1rem" }}>
                            {topic.resources.map((resource, resIndex) => (
                              <li key={resIndex}>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                  {resource.name}
                                </a> {" "}
                                - {resource.estimatedTimeHours} hours
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div style={{ marginTop: "1rem" }}>
                <Link to={`/plans/edit/${plan.id}`}>
                  <button>Edit</button>
                </Link>
                <button style={{ marginLeft: "1rem", backgroundColor: "#ff4d4d", color: "white" }}
                  onClick={() => handleDelete(plan.id)}>
                  Delete
                </button>
                <button style={{ marginLeft: "1rem", backgroundColor: "#888", color: "white" }}
                  onClick={() => handleArchiveToggle(plan.id)}>
                  {plan.archived ? "Unarchive" : "Archive"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LearningPlansPage;
