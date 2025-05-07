import React, { useState } from "react";
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

const CreateStructuredLearningPlanForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);

  const handleAddTopic = () => {
    setTopics([...topics, { title: "", resources: [] }]);
  };

  const handleTopicTitleChange = (index: number, newTitle: string) => {
    const updatedTopics = [...topics];
    updatedTopics[index].title = newTitle;
    setTopics(updatedTopics);
  };

  const handleAddResource = (topicIndex: number) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].resources.push({ name: "", url: "", estimatedTimeHours: 0 });
    setTopics(updatedTopics);
  };

  const handleResourceChange = (topicIndex: number, resourceIndex: number, field: keyof Resource, value: string | number) => {
    const updatedTopics = [...topics];
    (updatedTopics[topicIndex].resources[resourceIndex] as any)[field] = value;
    setTopics(updatedTopics);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await apiFetch("/learning-plans", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          userId: user?.email,    // ✅ Important: set user email
          topics,
          archived: false         // ✅ Default
        }),
      });
      alert("Learning plan created successfully!");
      navigate("/plans");         // ✅ Redirect after success
    } catch (err) {
      console.error("Failed to create learning plan", err);
      alert("Failed to create plan. Please try again.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Create Structured Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Plan Title"
          required
        />
        <br /><br />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Plan Description"
          required
        />
        <br /><br />

        {topics.map((topic, topicIndex) => (
          <div key={topicIndex} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
            <input
              value={topic.title}
              onChange={(e) => handleTopicTitleChange(topicIndex, e.target.value)}
              placeholder="Topic Title"
              required
            />
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
              </div>
            ))}
            <button type="button" onClick={() => handleAddResource(topicIndex)}>➕ Add Resource</button>
          </div>
        ))}

        <button type="button" onClick={handleAddTopic}>➕ Add Topic</button>
        <br /><br />
        <button type="submit">🚀 Create Learning Plan</button>
      </form>
    </div>
  );
};

export default CreateStructuredLearningPlanForm;
