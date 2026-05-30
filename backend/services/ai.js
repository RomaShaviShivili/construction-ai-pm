import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const ANALYSIS_SCHEMA = `{
  "delay_risk": "72%",
  "budget_risk": "55%",
  "prediction": "სავარაუდოდ 12 დღით გადაიწევა",
  "estimated_completion": "2026-09-12",
  "on_time_likelihood": "35%",
  "issues": ["string"],
  "recommendations": ["string"]
}`;

function mockAnalysis(project) {
  const spentRatio = project.spent / project.budget;
  const progressGap = Math.max(0, 100 - project.progress) / 100;
  const delayRisk = Math.min(95, Math.round(40 + spentRatio * 30 + progressGap * 25 + project.issues.length * 5));
  const budgetRisk = Math.min(95, Math.round(30 + spentRatio * 50 + (project.progress < 50 ? 15 : 0)));
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
    return `მიმდინარე მონაცემებით **${p.project_name}** გაზრდილ რისკზეა: ${p.progress}% დასრულებული, დახარჯულია $${(p.spent / 1e6).toFixed(1)}M $${(p.budget / 1e6).toFixed(1)}M ბიუჯეტიდან. ძირითადი საკითხები: ${p.issues.join(', ')}. გირჩევთ დაჩქაროთ კრიტიკული გზის მომწოდება და ჩაიწეროთ აღდგენის გრაფიკის სემინარი.`;
  }
  if (lower.includes('ბიუჯეტ') || lower.includes('budget') || lower.includes('ხარჯ')) {
    const atRisk = projects.filter((p) => p.spent / p.budget > 0.6 && p.progress < 70);
    if (!atRisk.length)
      return 'პორტფელის დახარჯვა პროგრესთან თანხვედრია. გააგრძელეთ ყოველთვიური variance ანალიზი.';
    return `ბიუჯეტის დაძაბულობა: ${atRisk.map((p) => p.project_name).join(', ')}. ფოკუსი change-order დისციპლინაზე და forecast-to-complete განახლებაზე.`;
  }
  return `მე თქვენი სამშენებლო PM ასისტენტი ვარ. გაქვთ ${projects.length} აქტიური პროექტი. კითხვა დასვით კონკრეტულ ობექტზე, რისკებზე ან ვადებზე — მაგ. „რომელი პროექტი ყველაზე სავარაუდოდ გადაიწევა?“`;
}

export async function analyzeProject(project) {
  if (!openai) {
    return mockAnalysis(project);
  }

  const prompt = `შენ ხარ სამშენებლო პროექტების მართვის ექსპერტი AI. გაანალიზე პროექტი და უპასუხე მხოლოდ ქართულ ენაზე, სწორი JSON-ით (markdown არა):
${ANALYSIS_SCHEMA}

პროექტის მონაცემები:
${JSON.stringify(project, null, 2)}

გაითვალისწინე: earned value (დახარჯვა vs პროგრესი vs ბიუჯეტი), ვადა ${project.deadline}, ჩამოთვლილი საკითხები. პროცენტებს უნდა ჰქონდეს % ნიშანი. prediction, issues, recommendations — ქართულად.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'შენ გამოაქვს მხოლოდ სწორი JSON სამშენებლო რისკის ანალიზისთვის. ყველა ტექსტური ველი ქართულად.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(text);
  } catch (err) {
    console.error('OpenAI analyze error:', err.message);
    return mockAnalysis(project);
  }
}

export async function chatWithAssistant(message, projects, history = []) {
  if (!openai) {
    return { reply: mockChat(message, projects) };
  }

  const context = projects.map((p) => ({
    name: p.project_name,
    budget: p.budget,
    spent: p.spent,
    progress: p.progress,
    deadline: p.deadline,
    issues: p.issues,
  }));

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `შენ ხარ გამოცდილი სამშენებლო პროექტების მენეჯერი, რომელიც ურჩევს დირექტორებს და PM-ებს. პორტფელის კონტექსტი: ${JSON.stringify(context)}. ყოველთვის უპასუხე ქართულ ენაზე. იყავი მოკლე, პრაქტიკული, მიუთითე კონკრეტულ პროექტებზე საჭიროებისამებრ. markdown მინიმალურად (bold ხაზახლს).`,
        },
        ...history.slice(-6).map((h) => ({ role: h.role, content: h.content })),
        { role: 'user', content: message },
      ],
      temperature: 0.5,
    });

    return { reply: completion.choices[0]?.message?.content || mockChat(message, projects) };
  } catch (err) {
    console.error('OpenAI chat error:', err.message);
    return { reply: mockChat(message, projects) };
  }
}

export function hasOpenAI() {
  return Boolean(openai);
}
