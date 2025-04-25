import React, { useState } from "react";
import { apiFetch } from "../api/api";

type LearningPlan = {
  id: string;
  title: string;
  description: string;
  topics: string[];
  resources: string[];
  archived: boolean;
  userId?: string;
};

const ExplorePlansPage: React.FC = () => {
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

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Explore Learning Plans</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for topics, titles, or descriptions..."
          style={{ padding: "0.5rem", width: "100%", maxWidth: "400px" }}
        />
        <button type="submit" style={{ marginLeft: "1rem" }}>Search</button>
      </form>

      <div style={{ marginTop: "1.5rem" }}>
        {loading && <p>Loading results...</p>}
        {!loading && results.length === 0 && <p>No results found.</p>}
        {!loading && results.length > 0 && (
          <ul>
            {results.map((plan) => (
              <li key={plan.id} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
                <h3>{plan.title}</h3>
                <p>{plan.description}</p>
                <p><strong>Topics:</strong> {plan.topics.join(", ")}</p>
                <p><strong>Resources:</strong> {plan.resources.join(", ")}</p>
                <p><strong>Status:</strong> {plan.archived ? "Archived" : "Active"}</p>
                <p><strong>Created by:</strong> {plan.userId || "Unknown"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExplorePlansPage;
