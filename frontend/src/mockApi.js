// Mock AI Logic - პროექტების ანალიზი
function mockAnalysis(project) {
  const spentRatio = project.spent / project.budget;
  const progressGap = Math.max(0, 100 - project.progress) / 100;
  const delayRisk = Math.min(
    95,
    Math.round(40 + spentRatio * 30 + progressGap * 25 + project.issues.length * 5)
  );
  const budgetRisk = Math.min(
    95,
    Math.round(30 + spentRatio * 50 + (project.progress < 50 ? 15 : 0))
  );
  const daysLate = Math.round((delayRisk / 100) * 30);

  const deadline = new Date(project.deadline);
  const estimated = new Date(deadline);
  estimated.setDate(estimated.getDate() + daysLate);

  const recPath = 'დაადასტურეთ კრიტიკული გზა სახელოსნოსთან ამ კვირაში';

  return {
    delay_risk: `${delayRisk}%`,
    budget_risk: `${budgetRisk}%`,
    prediction:
      delayRisk > 60
        ? `სავარაუდოდ ${daysLate} დღით გადაიწევა`
        : delayRisk > 35
          ? 'შესაძლოა მცირე გრაფიკის გადახვევა'
          : 'მიმდინარე ეტაპისთვის გრაფიკზეა',
    estimated_completion: estimated.toISOString().split('T')[0],
    on_time_likelihood: `${Math.max(5, 100 - delayRisk - 10)}%`,
    issues: project.issues.length
      ? project.issues
      : ['კრიტიკული დაბლოკვა არ არის — აკონტროლეთ დახარჯვა vs პროგრესი'],
    recommendations: [
      spentRatio > 0.7 && project.progress < 70
        ? 'გადახედეთ ხარჯების კონტროლს და განაახლეთ დარჩენილი სამუშაოების ბაზა'
        : 'გააგრძელეთ კვირეული earned-value ანგარიშგება',
      project.issues.some((i) => i.toLowerCase().includes('მასალ'))
        ? 'განსხვავებული მომწოდებლები და გრძელვადიანი მასალების დაჯავშნა'
        : recPath,
      '5 სამუშაო დღის განმავლობაში ჩაიწერეთ სტეიკჰოლდერების რისკის შეხვედრა',
    ],
  };
}

// Mock Chat Response
function mockChat(message, projects) {
  const lower = message.toLowerCase();
  if (
    lower.includes('ბათუმ') ||
    lower.includes('batumi') ||
    lower.includes('რისკ') ||
    lower.includes('risk')
  ) {
    const p =
      projects.find((x) => x.project_name.includes('ბათუმ') || x.project_name.includes('Batumi')) ||
      projects[0];
    return `მიმდინარე მონაცემებით **${p.project_name}** გაზრდილ რისკზეა: ${p.progress}% დასრულებული, დიდი ხარჯები.`;
  }
  if (lower.includes('ბიუჯეტ') || lower.includes('budget') || lower.includes('ხარჯ')) {
    const atRisk = projects.filter((p) => p.spent / p.budget > 0.6 && p.progress < 70);
    if (!atRisk.length)
      return 'პორტფელის დახარჯვა პროგრესთან თანხვედრია. გააგრძელეთ ყოველთვიური ვერიფიკაცია.';
    return `ბიუჯეტის დაძაბულობა: ${atRisk.map((p) => p.project_name).join(', ')}. ფოკუსი change-order დისციპლინაზე.`;
  }
  return `მე თქვენი სამშენებლო PM ასისტენტი ვარ. გაქვთ ${projects.length} აქტიური პროექტი. კითხეთ რის შესახებ გსურთ!`;
}

// Mock Projects Storage (localStorage)
let mockProjects = null;

function loadMockProjects() {
  if (mockProjects) return mockProjects;

  const stored = localStorage.getItem('construction-ai-projects');
  if (stored) {
    try {
      mockProjects = JSON.parse(stored);
      return mockProjects;
    } catch {
      // Invalid JSON, use defaults
    }
  }

  // Default demo projects
  mockProjects = [
    {
      id: '1',
      project_name: 'ბათუმის კოშკი',
      budget: 5000000,
      spent: 3200000,
      progress: 62,
      deadline: '2026-08-01',
      issues: ['ამინმირის დაგვიანება', 'მასალების ნაკლებობა'],
      progress_history: [
        { date: '2025-11-01', progress: 12 },
        { date: '2025-12-01', progress: 22 },
        { date: '2026-01-01', progress: 35 },
        { date: '2026-02-01', progress: 48 },
        { date: '2026-03-01', progress: 55 },
        { date: '2026-04-01', progress: 62 },
      ],
    },
    {
      id: '2',
      project_name: 'თბილისის მეტროს გაფართოება',
      budget: 12000000,
      spent: 4100000,
      progress: 38,
      deadline: '2027-03-15',
      issues: ['ნებართვების დაგვიანება', 'სამუშაო ძალის ნაკლებობა'],
      progress_history: [
        { date: '2025-09-01', progress: 5 },
        { date: '2025-11-01', progress: 14 },
        { date: '2026-01-01', progress: 24 },
        { date: '2026-03-01', progress: 38 },
      ],
    },
    {
      id: '3',
      project_name: 'ქუთაისის სამრეწველო პარკი',
      budget: 8500000,
      spent: 6200000,
      progress: 78,
      deadline: '2026-06-30',
      issues: ['ტექნიკის მცირე დაგვიანება'],
      progress_history: [
        { date: '2025-08-01', progress: 20 },
        { date: '2025-10-01', progress: 40 },
        { date: '2025-12-01', progress: 58 },
        { date: '2026-02-01', progress: 70 },
        { date: '2026-04-01', progress: 78 },
      ],
    },
    {
      id: '4',
      project_name: 'შავი ზღვის რეზორტი',
      budget: 15000000,
      spent: 2800000,
      progress: 18,
      deadline: '2028-12-01',
      issues: ['ფუნდამენტის გადაპროექტება', 'მომწოდებლის ვადები'],
      progress_history: [
        { date: '2026-01-01', progress: 8 },
        { date: '2026-03-01', progress: 14 },
        { date: '2026-05-01', progress: 18 },
      ],
    },
  ];

  saveMockProjects();
  return mockProjects;
}

function saveMockProjects() {
  localStorage.setItem('construction-ai-projects', JSON.stringify(mockProjects));
}

// Mock API with UUID generation
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const mockApi = {
  async getProjects() {
    return loadMockProjects();
  },

  async getProject(id) {
    const projects = loadMockProjects();
    const project = projects.find((p) => p.id === id);
    if (!project) throw new Error('Project not found');
    return project;
  },

  async createProject(data) {
    const projects = loadMockProjects();
    const project = {
      id: generateId(),
      project_name: data.project_name || 'Untitled Project',
      budget: Number(data.budget) || 0,
      spent: Number(data.spent) || 0,
      progress: Number(data.progress) || 0,
      deadline: data.deadline || new Date().toISOString().split('T')[0],
      issues: Array.isArray(data.issues) ? data.issues : [],
      progress_history: data.progress_history || [
        { date: new Date().toISOString().split('T')[0], progress: Number(data.progress) || 0 },
      ],
    };
    projects.push(project);
    mockProjects = projects;
    saveMockProjects();
    return project;
  },

  async updateProject(id, data) {
    const projects = loadMockProjects();
    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Project not found');
    projects[idx] = { ...projects[idx], ...data, id: projects[idx].id };
    mockProjects = projects;
    saveMockProjects();
    return projects[idx];
  },

  async deleteProject(id) {
    const projects = loadMockProjects();
    const initialLen = projects.length;
    mockProjects = projects.filter((p) => p.id !== id);
    if (mockProjects.length === initialLen) throw new Error('Project not found');
    saveMockProjects();
  },

  async analyzeProject(projectId) {
    const projects = loadMockProjects();
    const project = projects.find((p) => p.id === projectId);
    if (!project) throw new Error('Project not found');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      project_id: projectId,
      project_name: project.project_name,
      ...mockAnalysis(project),
    };
  },

  async chat(message, history = []) {
    const projects = loadMockProjects();
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      reply: mockChat(message, projects),
    };
  },

  async health() {
    return { status: 'ok', openai: false };
  },
};
