import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
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
  topics: Topic[];
  archived: boolean;
  userId?: string;
};

const EditLearningPlanForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<LearningPlan>(`/learning-plans/${id}`)
      .then(setPlan)
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field: keyof LearningPlan, value: any) => {
    if (!plan) return;
    setPlan({ ...plan, [field]: value });
  };

  const handleTopicChange = (index: number, field: keyof Topic, value: any) => {
    if (!plan) return;
    const updatedTopics = [...plan.topics];
    (updatedTopics[index] as any)[field] = value;
    setPlan({ ...plan, topics: updatedTopics });
  };

  const handleResourceChange = (topicIndex: number, resourceIndex: number, field: keyof Resource, value: any) => {
    if (!plan) return;
    const updatedTopics = [...plan.topics];
    (updatedTopics[topicIndex].resources[resourceIndex] as any)[field] = value;
    setPlan({ ...plan, topics: updatedTopics });
  };

  const handleAddTopic = () => {
    if (!plan) return;
    setPlan({
      ...plan,
      topics: [...plan.topics, { title: "", resources: [] }],
    });
  };

  const handleRemoveTopic = (index: number) => {
    if (!plan) return;
    const updatedTopics = plan.topics.filter((_, idx) => idx !== index);
    setPlan({ ...plan, topics: updatedTopics });
  };

  const handleAddResource = (topicIndex: number) => {
    if (!plan) return;
    const updatedTopics = [...plan.topics];
    updatedTopics[topicIndex].resources.push({ name: "", url: "", estimatedTimeHours: 0 });
    setPlan({ ...plan, topics: updatedTopics });
  };

  const handleRemoveResource = (topicIndex: number, resourceIndex: number) => {
    if (!plan) return;
    const updatedTopics = [...plan.topics];
    updatedTopics[topicIndex].resources = updatedTopics[topicIndex].resources.filter((_, idx) => idx !== resourceIndex);
    setPlan({ ...plan, topics: updatedTopics });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    try {
      await apiFetch(`/learning-plans/${id}`, {
        method: "PUT",
        body: JSON.stringify(plan),
      });
      alert("Plan updated successfully!");
      navigate("/plans");
    } catch (err) {
      console.error("Failed to update", err);
      alert("Failed to update. Please try again.");
    }
  };

  if (loading || !plan) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1.5rem", maxWidth: "800px", margin: "auto" }}>
      <h2>Edit Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={plan.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Plan Title"
          required
          style={{
            padding: "10px",
            marginBottom: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "100%",
          }}
        />

        <textarea
          value={plan.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Plan Description"
          required
          style={{
            padding: "10px",
            marginBottom: "1.5rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "100%",
            minHeight: "80px",
          }}
        />

        {plan.topics.map((topic, topicIndex) => (
          <div key={topicIndex} style={{
            marginBottom: "2rem",
            padding: "1rem",
            borderRadius: "10px",
            backgroundColor: "#f5f6f7",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <input
              value={topic.title}
              onChange={(e) => handleTopicChange(topicIndex, "title", e.target.value)}
              placeholder="Topic Title"
              required
              style={{
                padding: "8px",
                marginBottom: "1rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                width: "100%",
              }}
            />

            {topic.resources.map((resource, resourceIndex) => (
              <div key={resourceIndex} style={{ marginBottom: "1rem" }}>
                <input
                  value={resource.name}
                  onChange={(e) => handleResourceChange(topicIndex, resourceIndex, "name", e.target.value)}
                  placeholder="Resource Name"
                  required
                  style={{
                    marginBottom: "5px",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    width: "100%",
                  }}
                />
                <input
                  value={resource.url}
                  onChange={(e) => handleResourceChange(topicIndex, resourceIndex, "url", e.target.value)}
                  placeholder="Resource URL"
                  required
                  style={{
                    marginBottom: "5px",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    width: "100%",
                  }}
                />
                <input
                  type="number"
                  value={resource.estimatedTimeHours}
                  onChange={(e) => handleResourceChange(topicIndex, resourceIndex, "estimatedTimeHours", Number(e.target.value))}
                  placeholder="Estimated Time (hours)"
                  required
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    width: "100%",
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveResource(topicIndex, resourceIndex)}
                  style={{
                    marginTop: "0.5rem",
                    backgroundColor: "#ff4d4d",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  🗑 Remove Resource
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => handleAddResource(topicIndex)}
              style={{
                backgroundColor: "#1877f2",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              ➕ Add Resource
            </button>

            <br /><br />
            <button
              type="button"
              onClick={() => handleRemoveTopic(topicIndex)}
              style={{
                backgroundColor: "#d9534f",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              🗑 Remove Topic
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddTopic}
          style={{
            backgroundColor: "#5cb85c",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          ➕ Add Topic
        </button>

        <br />
        <button
          type="submit"
          style={{
            backgroundColor: "#1877f2",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ✅ Save Changes
        </button>
      </form>

      <hr />
      <h2 style={{ marginTop: "2rem", color: "#1877f2" }}>Track Your Learning Progress</h2>
      {id && <StructuredProgressTracker learningPlanId={id} />}
    </div>
  );
};

export default EditLearningPlanForm;
