import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Code, Video, TrendingUp, LayoutDashboard, BookOpen, ClipboardCheck, FolderOpen, User, ChevronRight, Plus, History, Trash2, Search, Zap } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Radar } from 'recharts';
import { useState, useEffect, createContext, useContext } from 'react';

// Types and Interfaces
interface SkillCategory {
  name: string;
  skills: string[];
}

interface ExtractedSkills {
  [category: string]: string[];
}

interface PreparationPlan {
  day: number;
  focus: string;
  tasks: string[];
}

interface ChecklistRound {
  round: number;
  name: string;
  items: string[];
}

interface InterviewQuestion {
  question: string;
  skill: string;
}

interface AnalysisEntry {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: ExtractedSkills;
  plan: PreparationPlan[];
  checklist: ChecklistRound[];
  questions: InterviewQuestion[];
  readinessScore: number;
}

interface AnalysisContextType {
  currentAnalysis: AnalysisEntry | null;
  setCurrentAnalysis: (analysis: AnalysisEntry | null) => void;
  history: AnalysisEntry[];
  addToHistory: (entry: AnalysisEntry) => void;
  deleteFromHistory: (id: string) => void;
}

const AnalysisContext = createContext<AnalysisContextType | null>(null);

// Skill Categories
const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'Core CS',
    skills: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks']
  },
  {
    name: 'Languages',
    skills: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C\\+\\+', 'C#', 'Go']
  },
  {
    name: 'Web',
    skills: ['React', 'Next\\.js', 'Node\\.js', 'Express', 'REST', 'GraphQL']
  },
  {
    name: 'Data',
    skills: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis']
  },
  {
    name: 'Cloud/DevOps',
    skills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux']
  },
  {
    name: 'Testing',
    skills: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest']
  }
];

// Skill Extraction Logic
function extractSkills(jdText: string): ExtractedSkills {
  const lowerJd = jdText.toLowerCase();
  const extracted: ExtractedSkills = {};

  for (const category of SKILL_CATEGORIES) {
    const foundSkills: string[] = [];
    for (const skill of category.skills) {
      const pattern = new RegExp(skill, 'gi');
      if (pattern.test(lowerJd)) {
        foundSkills.push(skill.replace('\\+', '+').replace('\\.js', '.js'));
      }
    }
    if (foundSkills.length > 0) {
      extracted[category.name] = foundSkills;
    }
  }

  return extracted;
}

// Readiness Score Calculation
function calculateReadinessScore(jdText: string, company: string, role: string, skills: ExtractedSkills): number {
  let score = 35;

  // +5 per detected category (max 30)
  const categoryCount = Object.keys(skills).length;
  score += Math.min(categoryCount * 5, 30);

  // +10 if company provided
  if (company.trim()) score += 10;

  // +10 if role provided
  if (role.trim()) score += 10;

  // +10 if JD length > 800 chars
  if (jdText.length > 800) score += 10;

  return Math.min(score, 100);
}

// Generate Preparation Plan based on skills
function generatePlan(skills: ExtractedSkills): PreparationPlan[] {
  const skillKeys = Object.keys(skills).flatMap(k => skills[k] || []);
  const hasReact = skillKeys.some(s => s.includes('React') || s.includes('Node'));
  const hasSQL = skillKeys.some(s => s.includes('SQL') || s.includes('MongoDB'));
  const hasDSA = skillKeys.includes('DSA');

  return [
    {
      day: 1,
      focus: 'Basics & Core CS',
      tasks: hasDSA 
        ? ['Revise arrays and strings', 'Practice 5 easy problems', 'Review time complexity']
        : ['Revise OOP concepts', 'Review DBMS fundamentals', 'Practice SQL queries']
    },
    {
      day: 2,
      focus: 'Core CS Deep Dive',
      tasks: hasDSA
        ? ['Learn linked lists', 'Practice 3 linked list problems', 'Revise stack and queue']
        : ['Revise OS processes', 'Study memory management', 'Review networking basics']
    },
    {
      day: 3,
      focus: 'DSA Practice',
      tasks: hasDSA
        ? ['Learn sorting algorithms', 'Practice binary search', 'Solve 5 medium problems']
        : ['Skip DSA focus', 'Review system design basics']
    },
    {
      day: 4,
      focus: 'Advanced DSA',
      tasks: hasDSA
        ? ['Learn dynamic programming basics', 'Practice tree traversals', 'Revise graph algorithms']
        : ['Focus on practical skills', 'Build sample projects']
    },
    {
      day: 5,
      focus: 'Projects & Resume',
      tasks: [
        ...(hasReact ? ['Prepare frontend project explanation', 'Review React lifecycle'] : []),
        ...(hasSQL ? ['Prepare database project', 'Explain schema design'] : []),
        'Align resume with JD keywords',
        'Prepare project stories'
      ].slice(0, 4)
    },
    {
      day: 6,
      focus: 'Mock Interview Prep',
      tasks: [
        'Prepare 3 project stories',
        'Practice "Tell me about yourself"',
        'Review common HR questions',
        'Prepare questions for interviewer'
      ]
    },
    {
      day: 7,
      focus: 'Revision & Weak Areas',
      tasks: [
        'Identify weak topics from practice',
        'Revise important concepts',
        'Review company-specific topics',
        'Stay confident and rest'
      ]
    }
  ];
}

// Generate Checklist based on skills
function generateChecklist(skills: ExtractedSkills): ChecklistRound[] {
  const skillKeys = Object.keys(skills).flatMap(k => skills[k] || []);
  
  return [
    {
      round: 1,
      name: 'Aptitude / Basics',
      items: [
        'Quantitative aptitude practice',
        'Logical reasoning puzzles',
        'Verbal ability and grammar',
        'Reading comprehension',
        'Number systems and percentages',
        'Time and work problems'
      ]
    },
    {
      round: 2,
      name: 'DSA + Core CS',
      items: skillKeys.includes('DSA')
        ? ['Arrays and strings', 'Linked lists', 'Trees and graphs', 'Dynamic programming', 'Sorting and searching', 'Stack and queue implementations']
        : ['OOP principles', 'Database normalization', 'SQL queries', 'Operating system processes', 'Memory management', 'Networking protocols']
    },
    {
      round: 3,
      name: 'Tech Interview',
      items: [
        ...(skillKeys.includes('React') ? ['React state management', 'Component lifecycle'] : []),
        ...(skillKeys.some(s => s.includes('SQL') || s.includes('MongoDB')) ? ['Database indexing', 'Query optimization', 'ACID properties'] : []),
        ...(skillKeys.includes('DSA') ? ['Problem-solving approach', 'Code optimization', 'Big O analysis'] : []),
        'Project deep-dive preparation',
        'System design basics',
        'Code review best practices'
      ].slice(0, 7)
    },
    {
      round: 4,
      name: 'Managerial / HR',
      items: [
        'Tell me about yourself',
        'Why this company?',
        'Strengths and weaknesses',
        'Leadership examples',
        'Conflict resolution',
        'Career goals',
        'Questions for manager'
      ]
    }
  ];
}

// Generate Interview Questions based on skills
function generateQuestions(skills: ExtractedSkills): InterviewQuestion[] {
  const skillKeys = Object.keys(skills).flatMap(k => skills[k] || []);
  const questions: InterviewQuestion[] = [];

  const skillQuestions: { [key: string]: string[] } = {
    'DSA': [
      'How would you optimize search in sorted data?',
      'Explain the difference between BFS and DFS.',
      'How would you find the shortest path in a weighted graph?',
      'When would you use a hash table vs an array?'
    ],
    'React': [
      'Explain state management options in React.',
      'What is the virtual DOM and how does it work?',
      'Explain React component lifecycle methods.',
      'When would you use useEffect hook?'
    ],
    'SQL': [
      'Explain indexing and when it helps.',
      'What is the difference between INNER and OUTER JOIN?',
      'Explain ACID properties.',
      'How would you optimize a slow SQL query?'
    ],
    'Node.js': [
      'Explain the event loop in Node.js.',
      'How does async/await work under the hood?',
      'What is middleware in Express?',
      'How would you handle errors in async operations?'
    ],
    'OOP': [
      'What are the four pillars of OOP?',
      'Explain inheritance vs composition.',
      'What is polymorphism?',
      'Describe the SOLID principles.'
    ],
    'DBMS': [
      'What is database normalization?',
      'Explain the different normal forms.',
      'What is a transaction?',
      'How does indexing improve query performance?'
    ],
    'OS': [
      'Explain the process vs thread.',
      'What is deadlock and how to prevent it?',
      'How does memory management work?',
      'What is virtual memory?'
    ],
    'JavaScript': [
      'Explain closures in JavaScript.',
      'What is the difference between var, let, and const?',
      'How does hoisting work?',
      'Explain event bubbling and capturing.'
    ],
    'Python': [
      'What is the difference between list and tuple?',
      'Explain Python\'s GIL.',
      'How would you handle exceptions in Python?',
      'What are Python decorators?'
    ],
    'AWS': [
      'What is the difference between S3 and EBS?',
      'Explain AWS Lambda.',
      'What is EC2 and its use cases?',
      'How would you secure an S3 bucket?'
    ],
    'Docker': [
      'What is the difference between Docker and VM?',
      'Explain Docker networking.',
      'How would you debug a container?',
      'What are Docker volumes?'
    ]
  };

  for (const skill of skillKeys) {
    if (skillQuestions[skill]) {
      questions.push(
        ...skillQuestions[skill].slice(0, 2).map(q => ({ question: q, skill }))
      );
    }
  }

  // Add generic questions if not enough
  const genericQuestions = [
    'Tell me about a challenging problem you solved.',
    'Explain your project architecture.',
    'How do you handle tight deadlines?',
    'What is your debugging approach?'
  ];

  while (questions.length < 10) {
    const idx = questions.length % genericQuestions.length;
    questions.push({ question: genericQuestions[idx], skill: 'General' });
  }

  return questions.slice(0, 10);
}

// Context Provider
function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisEntry | null>(null);
  const [history, setHistory] = useState<AnalysisEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('placementPrepHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const addToHistory = (entry: AnalysisEntry) => {
    const newHistory = [entry, ...history];
    setHistory(newHistory);
    localStorage.setItem('placementPrepHistory', JSON.stringify(newHistory));
  };

  const deleteFromHistory = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('placementPrepHistory', JSON.stringify(newHistory));
  };

  return (
    <AnalysisContext.Provider value={{ currentAnalysis, setCurrentAnalysis, history, addToHistory, deleteFromHistory }}>
      {children}
    </AnalysisContext.Provider>
  );
}

function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within AnalysisProvider');
  }
  return context;
}

// Card components (shadcn/ui style)
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

// Circular Progress Component
function CircularProgress({ value, max }: { value: number; max: number }) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="hsl(245, 58%, 51%)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">/ {max}</span>
      </div>
    </div>
  );
}

// Skill Radar Chart
function SkillRadarChart({ skills }: { skills: ExtractedSkills }) {
  const radarData = Object.entries(skills).map(([category, skillList]) => ({
    skill: category,
    value: Math.min(skillList.length * 25, 100),
    fullMark: 100
  }));

  if (radarData.length === 0) {
    radarData.push(
      { skill: 'Core CS', value: 25, fullMark: 100 },
      { skill: 'Languages', value: 25, fullMark: 100 },
      { skill: 'Web', value: 25, fullMark: 100 },
      { skill: 'Data', value: 25, fullMark: 100 },
      { skill: 'Cloud', value: 25, fullMark: 100 }
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="skill" tick={{ fill: '#6b7280', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="Skills" dataKey="value" stroke="hsl(245, 58%, 51%)" fill="hsl(245, 58%, 51%)" fillOpacity={0.3} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// Analyze Page
function AnalyzePage() {
  const navigate = useNavigate();
  const { addToHistory, setCurrentAnalysis } = useAnalysis();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!jdText.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const extractedSkills = extractSkills(jdText);
      
      // Show "General fresher stack" if no skills detected
      if (Object.keys(extractedSkills).length === 0) {
        extractedSkills['General'] = ['Problem Solving', 'Communication', 'Basic Programming'];
      }

      const readinessScore = calculateReadinessScore(jdText, company, role, extractedSkills);
      const plan = generatePlan(extractedSkills);
      const checklist = generateChecklist(extractedSkills);
      const questions = generateQuestions(extractedSkills);

      const entry: AnalysisEntry = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        company: company || 'Not specified',
        role: role || 'Not specified',
        jdText,
        extractedSkills,
        plan,
        checklist,
        questions,
        readinessScore
      };

      addToHistory(entry);
      setCurrentAnalysis(entry);
      setIsAnalyzing(false);
      navigate('/results');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Analyze Job Description</h2>
        <p className="text-gray-500">Paste a job description to get personalized preparation plan</p>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Google, Amazon"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., SDE I, Frontend Developer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description here..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">{jdText.length} characters</p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!jdText.trim() || isAnalyzing}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              jdText.trim() && !isAnalyzing
                ? 'bg-[hsl(245,58%,51%)] hover:bg-[hsl(245,58%,45%)] text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              'Analyze JD'
            )}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

// Results Page
function ResultsPage() {
  const { currentAnalysis } = useAnalysis();
  const navigate = useNavigate();

  if (!currentAnalysis) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">No analysis found</p>
        <button onClick={() => navigate('/analyze')} className="text-indigo-600 hover:underline">
          Analyze a job description
        </button>
      </div>
    );
  }

  const { extractedSkills, readinessScore, plan, checklist, questions, company, role } = currentAnalysis;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
          <p className="text-gray-500">{company} - {role}</p>
        </div>
        <button onClick={() => navigate('/analyze')} className="text-indigo-600 hover:underline flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Analysis
        </button>
      </div>

      {/* Readiness Score */}
      <Card>
        <CardContent className="flex flex-col items-center py-8">
          <CircularProgress value={readinessScore} max={100} />
          <p className="mt-4 text-lg font-medium text-gray-700">Readiness Score</p>
          <p className="text-sm text-gray-500">
            Based on {Object.keys(extractedSkills).length} skill categories detected
          </p>
        </CardContent>
      </Card>

      {/* Skill Breakdown */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Skill Breakdown</h3>
        </CardHeader>
        <CardContent>
          <SkillRadarChart skills={extractedSkills} />
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(extractedSkills).map(([category, skills]) => (
              <div key={category} className="mb-3 mr-3">
                <span className="text-xs font-medium text-gray-500 uppercase">{category}:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Plan */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">7-Day Preparation Plan</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plan.map(day => (
              <div key={day.day} className="flex gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-700 font-semibold">{day.day}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{day.focus}</h4>
                  <ul className="text-sm text-gray-600 mt-1">
                    {day.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-400">•</span> {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preparation Checklist */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Round-wise Preparation Checklist</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {checklist.map(round => (
              <div key={round.round}>
                <h4 className="font-medium text-gray-900 mb-2">Round {round.round}: {round.name}</h4>
                <div className="space-y-2">
                  {round.items.map((item, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interview Questions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Likely Interview Questions</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-700 text-sm font-medium">{idx + 1}</span>
                </div>
                <div>
                  <p className="text-gray-900">{q.question}</p>
                  <span className="text-xs text-indigo-600 mt-1 inline-block">{q.skill}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// History Page
function HistoryPage() {
  const { history, deleteFromHistory, setCurrentAnalysis } = useAnalysis();
  const navigate = useNavigate();

  const handleViewResult = (entry: AnalysisEntry) => {
    setCurrentAnalysis(entry);
    navigate('/results');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
        <p className="text-gray-500">View your previous job description analyses</p>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No analysis history yet</p>
            <button onClick={() => navigate('/analyze')} className="text-indigo-600 hover:underline">
              Analyze your first job description
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map(entry => (
            <Card key={entry.id} className="hover:border-indigo-300 transition-colors">
              <CardContent className="flex items-center justify-between py-4">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleViewResult(entry)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{entry.company}</h3>
                      <p className="text-sm text-gray-500">{entry.role}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{entry.readinessScore}</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFromHistory(entry.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Continue Practice Component
function ContinuePractice() {
  const progress = (3 / 10) * 100;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">Last Topic</span>
          <span className="text-xs text-gray-400">Continue Learning</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dynamic Programming</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-900 font-medium">3/10 completed</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[hsl(245,58%,51%)] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <button className="w-full bg-[hsl(245,58%,51%)] hover:bg-[hsl(245,58%,45%)] text-white py-2.5 rounded-lg font-medium transition-colors">
          Continue
        </button>
      </CardContent>
    </Card>
  );
}

// Weekly Goals Component
function WeeklyGoals() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activity = [true, true, false, true, true, false, true];
  
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Weekly Goals</h3>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Problems Solved</span>
            <span className="text-gray-900 font-medium">12/20 this week</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[hsl(245,58%,51%)] rounded-full transition-all duration-500" style={{ width: '60%' }} />
          </div>
        </div>
        <div className="flex justify-between">
          {days.map((day, index) => (
            <div key={day} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                activity[index] ? 'bg-[hsl(245,58%,51%)] text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {day.charAt(0)}
              </div>
              <span className="text-xs text-gray-500">{day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Upcoming Assessments Component
function UpcomingAssessments() {
  const assessments = [
    { title: 'DSA Mock Test', date: 'Tomorrow, 10:00 AM' },
    { title: 'System Design Review', date: 'Wed, 2:00 PM' },
    { title: 'HR Interview Prep', date: 'Friday, 11:00 AM' },
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Assessments</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {assessments.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-[hsl(245,58%,51%)]" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Dashboard Page Content
function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Track your placement preparation progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Overall Readiness</h3>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CircularProgress value={72} max={100} />
            <p className="mt-4 text-sm text-gray-500">Readiness Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Skill Breakdown</h3>
          </CardHeader>
          <CardContent>
            <SkillRadarChart skills={{ 'DSA': ['Arrays', 'Trees'], 'Web': ['React', 'Node'], 'Data': ['SQL'] }} />
          </CardContent>
        </Card>

        <ContinuePractice />
        <WeeklyGoals />

        <div className="lg:col-span-2">
          <UpcomingAssessments />
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-indigo-50 to-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Ace Your Placement</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Practice, assess, and prepare for your dream job
          </p>
          <button onClick={() => navigate('/dashboard')} className="bg-[hsl(245,58%,51%)] hover:bg-[hsl(245,58%,45%)] text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Get Started
          </button>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-[hsl(245,58%,51%)]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Practice Problems</h3>
              <p className="text-gray-600">Solve coding challenges across multiple difficulty levels</p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-[hsl(245,58%,51%)]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mock Interviews</h3>
              <p className="text-gray-600">Practice with real interview scenarios and get feedback</p>
            </div>
            
            <div className="p-6 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-[hsl(245,58%,51%)]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your performance and identify improvement areas</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Placement Prep. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Dashboard Layout Components
function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Search, label: 'Analyze JD', path: '/analyze' },
    { icon: History, label: 'History', path: '/history' },
    { icon: BookOpen, label: 'Practice', path: '/dashboard/practice' },
    { icon: ClipboardCheck, label: 'Assessments', path: '/dashboard/assessments' },
    { icon: FolderOpen, label: 'Resources', path: '/dashboard/resources' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ];

  return (
    <aside className="w-64 bg-[hsl(245,58%,51%)] min-h-screen p-4">
      <div className="flex items-center gap-2 px-4 py-4 mb-8">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <span className="text-[hsl(245,58%,51%)] font-bold">P</span>
        </div>
        <span className="text-white font-semibold text-lg">Placement Prep</span>
      </div>
      
      <nav className="space-y-1">
        {navItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-900">Placement Prep</h1>
      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
        <User className="w-5 h-5 text-[hsl(245,58%,51%)]" />
      </div>
    </header>
  );
}

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <DashboardPage />
        </main>
      </div>
    </div>
  );
}

function AnalyzeLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <AnalyzePage />
        </main>
      </div>
    </div>
  );
}

function ResultsLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <ResultsPage />
        </main>
      </div>
    </div>
  );
}

function HistoryLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <HistoryPage />
        </main>
      </div>
    </div>
  );
}

// Placeholder Pages
function PracticePage() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Practice Problems</h2>
      <p className="text-gray-600">Coding practice challenges coming soon</p>
    </div>
  );
}

function AssessmentsPage() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Assessments</h2>
      <p className="text-gray-600">Mock tests and assessments coming soon</p>
    </div>
  );
}

function ResourcesPage() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Resources</h2>
      <p className="text-gray-600">Learning resources coming soon</p>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profile</h2>
      <p className="text-gray-600">User profile coming soon</p>
    </div>
  );
}

// Main App
function App() {
  return (
    <AnalysisProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="practice" element={<PracticePage />} />
            <Route path="assessments" element={<AssessmentsPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/analyze" element={<AnalyzeLayout />} />
          <Route path="/results" element={<ResultsLayout />} />
          <Route path="/history" element={<HistoryLayout />} />
        </Routes>
      </BrowserRouter>
    </AnalysisProvider>
  );
}

export default App;
