import { apiFetch } from './api';

export const createProgressEntry = async (planId: string, payload: { note: string }) => {
    return apiFetch(`/learning-plans/${planId}/progress`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };
  

export const getProgressEntries = async (planId: string) => {
  return apiFetch(`/learning-plans/${planId}/progress`);
};

export const updateProgressEntry = async (progressId: string, updatedData: any) => {
  return apiFetch(`/learning-plans/progress/${progressId}`, {
    method: 'PUT',
    body: JSON.stringify(updatedData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteProgressEntry = async (progressId: string) => {
  return apiFetch(`/learning-plans/progress/${progressId}`, {
    method: 'DELETE',
  });
};
