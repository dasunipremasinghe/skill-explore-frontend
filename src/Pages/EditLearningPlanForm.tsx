import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import ProgressTracker from "../Pages/ProgressTracker";

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
  const { id } = useParams(); // Using `id` from the URL params
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
      topics: [...plan.topics, { title: "", resources: [] }]
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
    <div style={{ padding: "1rem" }}>
      <h2>Edit Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={plan.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Plan Title"
          required
        />
        <br /><br />

        <textarea
          value={plan.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Plan Description"
          required
        />
        <br /><br />

        {plan.topics.map((topic, topicIndex) => (
          <div key={topicIndex} style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
            <input
              value={topic.title}
              onChange={(e) => handleTopicChange(topicIndex, "title", e.target.value)}
              placeholder="Topic Title"
              required
            />
            <button type="button" onClick={() => handleRemoveTopic(topicIndex)} style={{ marginLeft: "1rem", backgroundColor: "red", color: "white" }}>
              🗑 Remove Topic
            </button>

            <br /><br />

            {topic.resources.map((resource, resourceIndex) => (
              <div key={resourceIndex} style={{ marginBottom: "0.5rem" }}>
                <input
                  value={resource.name}
                  onChange={(e) => handleResourceChange(topicIndex, resourceIndex, "name", e.target.value)}
                  placeholder="Resource Name"
                  required
                />
                <input
                  value={resource.url}
                  onChange={(e) => handleResourceChange(topicIndex, resourceIndex, "url", e.target.value)}
                  placeholder="Resource URL"
                  required
                />
                <input
                  type="number"
                  value={resource.estimatedTimeHours}
                  onChange={(e) => handleResourceChange(topicIndex, resourceIndex, "estimatedTimeHours", Number(e.target.value))}
                  placeholder="Estimated Time (hours)"
                  required
                />
                <button type="button" onClick={() => handleRemoveResource(topicIndex, resourceIndex)} style={{ marginLeft: "0.5rem", backgroundColor: "#ff4d4d", color: "white" }}>
                  🗑 Remove Resource
                </button>
              </div>
            ))}

            <button type="button" onClick={() => handleAddResource(topicIndex)}>
              ➕ Add Resource
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddTopic}>
          ➕ Add Topic
        </button>

        <br /><br />
        <button type="submit">✅ Save Changes</button>
        <ProgressTracker learningPlanId={id} />
      </form>
    </div>
  );
};

export default EditLearningPlanForm;
