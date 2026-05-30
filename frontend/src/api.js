const API = import.meta.env.VITE_API_URL || '/api';

export async function fetchProjects() {
  const res = await fetch(`${API}/projects`);
  if (!res.ok) throw new Error('Failed to load projects');
  return res.json();
}

export async function analyzeProject(projectId) {
  const res = await fetch(`${API}/analyze-project`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project_id: projectId }),
  });
  if (!res.ok) throw new Error('Analysis failed');
  return res.json();
}

export async function sendChat(message, history) {
  const res = await fetch(`${API}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error('Chat failed');
  return res.json();
}

export async function fetchHealth() {
  const res = await fetch(`${API}/health`);
  return res.json();
}
