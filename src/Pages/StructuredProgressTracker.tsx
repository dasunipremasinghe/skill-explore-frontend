
import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiFetch } from "../api/api";

type ResourceProgress = {
  resourceName: string;
  completed: boolean;
};

type TopicProgress = {
  topicName: string;
  completed: boolean;
  resourceProgressList: ResourceProgress[];
};

type ProgressData = {
  id?: string;
  userId: string;
  learningPlanId: string;
  topicProgressList: TopicProgress[];
};

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
  topics: Topic[];
};

interface Props {
  learningPlanId: string;
}

const StructuredProgressTracker: React.FC<Props> = ({ learningPlanId }) => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlanAndProgress = async () => {
    if (!user) return;

    try {
      const planData = await apiFetch<LearningPlan>(`/learning-plans/${learningPlanId}`);
      setPlan(planData);

      const progressData = await apiFetch<ProgressData>(
        `/user-progress/${user.email}/${learningPlanId}`
      ).catch(() => null); // handle 404

      if (progressData) {
        setProgress(progressData);
      } else {
        const initialProgress: ProgressData = {
          userId: user.email,
          learningPlanId,
          topicProgressList: planData.topics.map((t) => ({
            topicName: t.title,
            completed: false,
            resourceProgressList: t.resources.map((r) => ({
              resourceName: r.name,
              completed: false,
            })),
          })),
        };
        setProgress(initialProgress);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = async (topicIndex: number) => {
    if (!progress) return;
    const updated = { ...progress };
    const topic = updated.topicProgressList[topicIndex];
    topic.completed = !topic.completed;
    setProgress(updated);
    await apiFetch("/user-progress", {
      method: "POST",
      body: JSON.stringify(updated),
    });
  };

  const toggleResource = async (topicIndex: number, resourceIndex: number) => {
    if (!progress) return;
    const updated = { ...progress };
    const resource = updated.topicProgressList[topicIndex].resourceProgressList[resourceIndex];
    resource.completed = !resource.completed;
    setProgress(updated);
    await apiFetch("/user-progress", {
      method: "POST",
      body: JSON.stringify(updated),
    });
  };

  useEffect(() => {
    fetchPlanAndProgress();
  }, [learningPlanId, user]);

  if (loading) return <div>Loading progress...</div>;
  if (!plan || !progress) return <div>Unable to load progress.</div>;

  return (
    <div style={{ padding: "1rem", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
      <h3 style={{ marginBottom: "1rem", color: "#1877f2" }}>Progress Checklist</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {plan.topics.map((topic, topicIndex) => (
          <li key={topicIndex} style={{
            marginBottom: "1rem",
            padding: "1rem",
            borderRadius: "8px",
            backgroundColor: "#f5f6f7",
          }}>
            <label style={{ fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={progress.topicProgressList[topicIndex]?.completed || false}
                onChange={() => toggleTopic(topicIndex)}
                style={{ marginRight: "10px" }}
              />
              {topic.title}
            </label>
  
            <ul style={{ listStyle: "none", marginLeft: "1rem", marginTop: "0.5rem", paddingLeft: 0 }}>
              {topic.resources.map((res, resIndex) => (
                <li key={resIndex} style={{ marginBottom: "0.25rem" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        progress.topicProgressList[topicIndex]?.resourceProgressList[resIndex]?.completed || false
                      }
                      onChange={() => toggleResource(topicIndex, resIndex)}
                      style={{ marginRight: "8px" }}
                    />
                    {res.name}
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
  
};

export default StructuredProgressTracker;
