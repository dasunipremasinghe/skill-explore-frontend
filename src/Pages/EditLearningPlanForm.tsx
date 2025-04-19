import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

type LearningPlan = {
  id: string;
  title: string;
  description: string;
  topics: string[];
  resources: string[];
  archived: boolean;
};

const EditLearningPlanForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [topicsInput, setTopicsInput] = useState("");
  const [resourcesInput, setResourcesInput] = useState("");

  useEffect(() => {
    apiFetch<LearningPlan>(`/learning-plans/${id}`)
      .then((fetchedPlan) => {
        setPlan(fetchedPlan);
        setTopicsInput(fetchedPlan.topics.join(", "));
        setResourcesInput(fetchedPlan.resources.join(", "));
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field: keyof LearningPlan) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!plan) return;
    setPlan({ ...plan, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch(`/learning-plans/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...plan,
          topics: topicsInput.split(",").map(t => t.trim()),
          resources: resourcesInput.split(",").map(r => r.trim())
        })
      });
      alert("Plan updated!");
      navigate("/plans");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (loading || !plan) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Edit Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <input value={plan.title} onChange={handleChange("title")} placeholder="Title" required />
        <br /><br />
        <textarea value={plan.description} onChange={handleChange("description")} placeholder="Description" required />
        <br /><br />
        <input value={topicsInput} onChange={(e) => setTopicsInput(e.target.value)} placeholder="Topics (comma-separated)" required />
        <br /><br />
        <input value={resourcesInput} onChange={(e) => setResourcesInput(e.target.value)} placeholder="Resources (comma-separated)" required />
        <br /><br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditLearningPlanForm;
