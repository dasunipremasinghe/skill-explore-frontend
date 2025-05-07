import React, { useEffect, useState } from "react";
import {
    createProgressEntry as createProgress,
    deleteProgressEntry as deleteProgress,
    getProgressEntries as getProgressByPlanId,
    updateProgressEntry as updateProgress,
} from "../api/progressAPI";

type ProgressEntry = {
  id: string;
  learningPlanId: string;
  date: string;
  note: string;
};

interface Props {
  learningPlanId: string;
}

const ProgressTracker: React.FC<Props> = ({ learningPlanId }) => {
  const [progressList, setProgressList] = useState<ProgressEntry[]>([]);
  const [note, setNote] = useState("");

  const fetchProgress = async () => {
    const entries = await getProgressByPlanId(learningPlanId);
    setProgressList(entries);
  };

  const handleAdd = async () => {
    if (!note.trim()) return;
    await createProgress(learningPlanId, { note });
    setNote("");
    fetchProgress();
  };

  const handleDelete = async (id: string) => {
    await deleteProgress(id);
    fetchProgress();
  };

  useEffect(() => {
    fetchProgress();
  }, [learningPlanId]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h4>Progress Tracker</h4>
      <input
        type="text"
        placeholder="Add progress note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ padding: "0.5rem", width: "70%" }}
      />
      <button onClick={handleAdd} style={{ marginLeft: "1rem" }}>
        Add
      </button>

      <ul>
        {progressList.map((entry) => (
          <li key={entry.id} style={{ marginTop: "1rem" }}>
            <strong>{entry.date}</strong>: {entry.note}
            <button
              onClick={() => handleDelete(entry.id)}
              style={{ marginLeft: "1rem" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressTracker;