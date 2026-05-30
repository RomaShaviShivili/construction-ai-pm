import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { analyzeProject, chatWithAssistant, hasOpenAI } from './services/ai.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, 'data', 'projects.json');

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const allowed =
      origin.startsWith('http://localhost:') ||
      origin.endsWith('.vercel.app') ||
      (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL);
    callback(null, Boolean(allowed));
  },
};

app.use(cors(corsOptions));
app.use(express.json());

function loadProjects() {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

function saveProjects(projects) {
  writeFileSync(DATA_PATH, JSON.stringify(projects, null, 2));
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', openai: hasOpenAI() });
});

app.get('/api/projects', (_req, res) => {
  res.json(loadProjects());
});

app.get('/api/projects/:id', (req, res) => {
  const project = loadProjects().find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

app.post('/api/projects', (req, res) => {
  const projects = loadProjects();
  const body = req.body;
  const project = {
    id: uuidv4(),
    project_name: body.project_name || 'Untitled Project',
    budget: Number(body.budget) || 0,
    spent: Number(body.spent) || 0,
    progress: Number(body.progress) || 0,
    deadline: body.deadline || new Date().toISOString().split('T')[0],
    issues: Array.isArray(body.issues) ? body.issues : [],
    progress_history: body.progress_history || [
      { date: new Date().toISOString().split('T')[0], progress: Number(body.progress) || 0 },
    ],
  };
  projects.push(project);
  saveProjects(projects);
  res.status(201).json(project);
});

app.put('/api/projects/:id', (req, res) => {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  projects[idx] = { ...projects[idx], ...req.body, id: projects[idx].id };
  saveProjects(projects);
  res.json(projects[idx]);
});

app.delete('/api/projects/:id', (req, res) => {
  let projects = loadProjects();
  const len = projects.length;
  projects = projects.filter((p) => p.id !== req.params.id);
  if (projects.length === len) return res.status(404).json({ error: 'Project not found' });
  saveProjects(projects);
  res.status(204).send();
});

app.post('/api/analyze-project', async (req, res) => {
  try {
    const { project_id, project: bodyProject } = req.body;
    let project = bodyProject;

    if (project_id) {
      project = loadProjects().find((p) => p.id === project_id);
      if (!project) return res.status(404).json({ error: 'Project not found' });
    }

    if (!project) {
      return res.status(400).json({ error: 'Provide project_id or project object' });
    }

    const analysis = await analyzeProject(project);
    res.json({ project_id: project.id || project_id, project_name: project.project_name, ...analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }
    const projects = loadProjects();
    const result = await chatWithAssistant(message.trim(), projects, history || []);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chat failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Construction AI PM API → http://localhost:${PORT}`);
  console.log(`OpenAI: ${hasOpenAI() ? 'enabled' : 'mock mode (set OPENAI_API_KEY)'}`);
});
