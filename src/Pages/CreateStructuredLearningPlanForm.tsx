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

  const handleDeleteTopic = (index: number) => {
    const updatedTopics = [...topics];
    updatedTopics.splice(index, 1);
    setTopics(updatedTopics);
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

  const handleDeleteResource = (topicIndex: number, resourceIndex: number) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].resources.splice(resourceIndex, 1);
    setTopics(updatedTopics);
  };

  const handleResourceChange = (
    topicIndex: number,
    resourceIndex: number,
    field: keyof Resource,
    value: string | number
  ) => {
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
          userId: user?.email,
          topics,
          archived: false,
        }),
      });
      alert("Learning plan created successfully!");
      navigate("/plans");
    } catch (err) {
      console.error("Failed to create learning plan", err);
      alert("Failed to create plan. Please try again.");
    }
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "800px", margin: "auto" }}>
      <h2>Create a Structured Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Plan Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

        {topics.map((topic, topicIndex) => (
          <div
            key={topicIndex}
            style={{
              marginBottom: "2rem",
              padding: "1rem",
              borderRadius: "10px",
              backgroundColor: "#f5f6f7",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <input
              type="text"
              placeholder="Topic Title"
              value={topic.title}
              onChange={(e) => handleTopicTitleChange(topicIndex, e.target.value)}
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
                  type="text"
                  placeholder="Resource Name"
                  value={resource.name}
                  onChange={(e) =>
                    handleResourceChange(topicIndex, resourceIndex, "name", e.target.value)
                  }
                  style={{
                    marginBottom: "5px",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    width: "100%",
                  }}
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={resource.url}
                  onChange={(e) =>
                    handleResourceChange(topicIndex, resourceIndex, "url", e.target.value)
                  }
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
                  placeholder="Estimated Time (hrs)"
                  value={resource.estimatedTimeHours}
                  onChange={(e) =>
                    handleResourceChange(
                      topicIndex,
                      resourceIndex,
                      "estimatedTimeHours",
                      parseInt(e.target.value)
                    )
                  }
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    width: "100%",
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteResource(topicIndex, resourceIndex)}
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
                  🗑 Remove
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
              onClick={() => handleDeleteTopic(topicIndex)}
              style={{
                backgroundColor: "#d9534f",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              🗑 Delete Topic
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
          ✅ Create Plan
        </button>
      </form>
    </div>
  );
};

export default CreateStructuredLearningPlanForm;
