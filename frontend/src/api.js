import { mockApi } from './mockApi.js';

const API = import.meta.env.VITE_API_URL || '/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_URL;

// Detect if backend is available
let backendAvailable = null;

async function isBackendAvailable() {
  if (backendAvailable !== null) return backendAvailable;

  try {
    const res = await fetch(`${API}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

// Wrapper to use mock if backend is unavailable
async function withFallback(fn) {
  const available = await isBackendAvailable();
  return available ? fn() : null;
}

export async function fetchProjects() {
  if (USE_MOCK) return mockApi.getProjects();

  const result = await withFallback(async () => {
    const res = await fetch(`${API}/projects`);
    if (!res.ok) throw new Error('Failed to load projects');
    return res.json();
  });

  return result || mockApi.getProjects();
}

export async function analyzeProject(projectId) {
  if (USE_MOCK) return mockApi.analyzeProject(projectId);

  const result = await withFallback(async () => {
    const res = await fetch(`${API}/analyze-project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId }),
    });
    if (!res.ok) throw new Error('Analysis failed');
    return res.json();
  });

  return result || mockApi.analyzeProject(projectId);
}

export async function sendChat(message, history) {
  if (USE_MOCK) return mockApi.chat(message, history);

  const result = await withFallback(async () => {
    const res = await fetch(`${API}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    if (!res.ok) throw new Error('Chat failed');
    return res.json();
  });

  return result || mockApi.chat(message, history);
}

export async function fetchHealth() {
  if (USE_MOCK) return mockApi.health();

  try {
    const res = await fetch(`${API}/health`);
    return res.json();
  } catch {
    return mockApi.health();
  }
}

// Project CRUD operations
export async function createProject(data) {
  if (USE_MOCK) return mockApi.createProject(data);

  const result = await withFallback(async () => {
    const res = await fetch(`${API}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  });

  return result || mockApi.createProject(data);
}

export async function updateProject(projectId, data) {
  if (USE_MOCK) return mockApi.updateProject(projectId, data);

  const result = await withFallback(async () => {
    const res = await fetch(`${API}/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  });

  return result || mockApi.updateProject(projectId, data);
}

export async function deleteProject(projectId) {
  if (USE_MOCK) return mockApi.deleteProject(projectId);

  const result = await withFallback(async () => {
    const res = await fetch(`${API}/projects/${projectId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete project');
  });

  if (result === null) return mockApi.deleteProject(projectId);
}
