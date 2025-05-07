import React, { useState } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateLearningPlanForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topics, setTopics] = useState("");
  const [resources, setResources] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPlan = {
      title,
      description,
      topics: topics.split(",").map(t => t.trim()),
      resources: resources.split(",").map(r => r.trim()),
      userId: user?.email,
      archived: false
    };

    try {
      await apiFetch("/learning-plans", {
        method: "POST",
        body: JSON.stringify(newPlan)
      });
      alert("Plan created!");
      navigate("/plans"); // Go back to dashboard
    } catch (err) {
      console.error("Failed to create plan", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Create a New Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <br /><br />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <br /><br />
        <input value={topics} onChange={(e) => setTopics(e.target.value)} placeholder="Topics (comma-separated)" required />
        <br /><br />
        <input value={resources} onChange={(e) => setResources(e.target.value)} placeholder="Resources (comma-separated)" required />
        <br /><br />
        <button type="submit">Create Plan</button>
      </form>
    </div>
  );
};

export default CreateLearningPlanForm;
