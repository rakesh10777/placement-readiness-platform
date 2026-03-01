import { BrowserRouter, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Code, Video, TrendingUp, LayoutDashboard, BookOpen, ClipboardCheck, FolderOpen, User, ChevronRight, Plus, History, Trash2, Search, Zap } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Radar } from 'recharts';
import { useState, useEffect, createContext, useContext } from 'react';

// Types and Interfaces
interface SkillCategory {
  name: string;
  skills: string[];
}

// Standardized extracted skills schema
interface ExtractedSkills {
  coreCS: string[];
  languages: string[];
  web: string[];
  data: string[];
  cloud: string[];
  testing: string[];
  other: string[];
}

// New standardized schema
interface PlanDay {
  day: number;
  focus: string;
  tasks: string[];
}

interface ChecklistRound {
  roundTitle: string;
  items: string[];
}

interface RoundMapEntry {
  roundTitle: string;
  focusAreas: string[];
  whyItMatters: string;
}

interface AnalysisEntry {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: ExtractedSkills;
  roundMapping: RoundMapEntry[];
  checklist: ChecklistRound[];
  plan7Days: PlanDay[];
  questions: string[];
  baseScore: number;
  skillConfidenceMap: { [skill: string]: 'know' | 'practice' };
  finalScore: number;
  updatedAt: string;
  companyIntel?: CompanyIntel;
  roundMappingLegacy?: RoundMapping[];
}

interface AnalysisContextType {
  currentAnalysis: AnalysisEntry | null;
  setCurrentAnalysis: (analysis: AnalysisEntry | null) => void;
  history: AnalysisEntry[];
  addToHistory: (entry: AnalysisEntry) => void;
  deleteFromHistory: (id: string) => void;
  updateEntry: (id: string, updates: Partial<AnalysisEntry>) => void;
  loadError: string | null;
}

const AnalysisContext = createContext<AnalysisContextType | null>(null);

// Skill Categories with schema mapping
const SKILL_CATEGORIES: { name: string; key: keyof ExtractedSkills; skills: string[] }[] = [
  { name: 'Core CS', key: 'coreCS', skills: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks'] },
  { name: 'Languages', key: 'languages', skills: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C\\+\\+', 'C#', 'Go'] },
  { name: 'Web', key: 'web', skills: ['React', 'Next\\.js', 'Node\\.js', 'Express', 'REST', 'GraphQL'] },
  { name: 'Data', key: 'data', skills: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'] },
  { name: 'Cloud/DevOps', key: 'cloud', skills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'] },
  { name: 'Testing', key: 'testing', skills: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest'] },
];

// Skill Extraction Logic - returns standardized schema
function extractSkills(jdText: string): ExtractedSkills {
  const lowerJd = jdText.toLowerCase();
  const extracted: ExtractedSkills = {
    coreCS: [],
    languages: [],
    web: [],
    data: [],
    cloud: [],
    testing: [],
    other: []
  };

  for (const category of SKILL_CATEGORIES) {
    for (const skill of category.skills) {
      const pattern = new RegExp(skill, 'gi');
      if (pattern.test(lowerJd)) {
        const cleanSkill = skill.replace('\\+', '+').replace('\\.js', '.js');
        extracted[category.key].push(cleanSkill);
      }
    }
  }

  // If no skills detected, populate "other" with default fresher skills
  const totalSkills = Object.keys(extracted).reduce((sum, key) => sum + extracted[key].length, 0);
  if (totalSkills === 0) {
    extracted.other = ['Communication', 'Problem solving', 'Basic coding', 'Projects'];
  }

  return extracted;
}

// Readiness Score Calculation
function calculateReadinessScore(jdText: string, company: string, role: string, skills: ExtractedSkills): number {
  let score = 35;

  // +5 per detected category (max 30)
  const categoryCount = Object.keys(skills).filter(k => skills[k].length > 0).length;
  score += Math.min(categoryCount * 5, 30);

  // +10 if company provided
  if (company.trim()) score += 10;

  // +10 if role provided
  if (role.trim()) score += 10;

  // +10 if JD length > 800 chars
  if (jdText.length > 800) score += 10;

  return Math.min(score, 100);
}

// Generate Preparation Plan based on skills - returns new schema
function generatePlan(skills: ExtractedSkills): PlanDay[] {
  const skillKeys = [
    ...skills.coreCS,
    ...skills.languages,
    ...skills.web,
    ...skills.data,
    ...skills.cloud,
    ...skills.testing,
    ...skills.other
  ];
  const hasReact = skillKeys.some(s => s.includes('React') || s.includes('Node'));
  const hasSQL = skillKeys.some(s => s.includes('SQL') || s.includes('MongoDB'));
  const hasDSA = skillKeys.includes('DSA');

  return [
    {
      day: 1,
      focus: 'Basics & Core CS',
      tasks: hasDSA 
        ? ['Revise arrays and strings', 'Practice 5 easy problems', 'Review time complexity']
        : hasSkills(skills)
          ? ['Revise OOP concepts', 'Review DBMS fundamentals', 'Practice SQL queries']
          : ['Practice communication', 'Review problem solving basics', 'Prepare self-introduction']
    },
    {
      day: 2,
      focus: 'Core CS Deep Dive',
      tasks: hasDSA
        ? ['Learn linked lists', 'Practice 3 linked list problems', 'Revise stack and queue']
        : hasSkills(skills)
          ? ['Revise OS processes', 'Study memory management', 'Review networking basics']
          : ['Prepare project portfolio', 'Review coding basics', 'Practice aptitude']
    },
    {
      day: 3,
      focus: 'DSA Practice',
      tasks: hasDSA
        ? ['Learn sorting algorithms', 'Practice binary search', 'Solve 5 medium problems']
        : hasSkills(skills)
          ? ['Skip DSA focus', 'Review system design basics']
          : ['Practice mock interviews', 'Review HR questions', 'Prepare questions for interviewer']
    },
    {
      day: 4,
      focus: 'Advanced Topics',
      tasks: hasDSA
        ? ['Learn dynamic programming basics', 'Practice tree traversals', 'Revise graph algorithms']
        : hasSkills(skills)
          ? ['Focus on practical skills', 'Build sample projects']
          : ['Final resume review', 'Research company', 'Relax and stay confident']
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

// Helper to check if any skills detected
function hasSkills(skills: ExtractedSkills): boolean {
  return Object.values(skills).some(arr => arr.length > 0);
}

// Generate Checklist based on skills - returns new schema
function generateChecklist(skills: ExtractedSkills): ChecklistRound[] {
  const skillKeys = [
    ...skills.coreCS,
    ...skills.languages,
    ...skills.web,
    ...skills.data,
    ...skills.cloud,
    ...skills.testing,
    ...skills.other
  ];
  
  const isEmpty = !hasSkills(skills);
  
  return [
    {
      roundTitle: 'Round 1: Aptitude / Basics',
      items: isEmpty
        ? ['Practice quantitative aptitude', 'Practice logical reasoning', 'Prepare verbal ability', 'Review number systems', 'Practice time and work']
        : ['Quantitative aptitude practice', 'Logical reasoning puzzles', 'Verbal ability and grammar', 'Reading comprehension', 'Number systems and percentages', 'Time and work problems']
    },
    {
      roundTitle: 'Round 2: DSA + Core CS',
      items: skillKeys.includes('DSA')
        ? ['Arrays and strings', 'Linked lists', 'Trees and graphs', 'Dynamic programming', 'Sorting and searching', 'Stack and queue implementations']
        : isEmpty
          ? ['OOP principles', 'Database basics', 'SQL fundamentals', 'Project discussion', 'Problem solving approach']
          : ['OOP principles', 'Database normalization', 'SQL queries', 'Operating system processes', 'Memory management', 'Networking protocols']
    },
    {
      roundTitle: 'Round 3: Tech Interview',
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
      roundTitle: 'Round 4: Managerial / HR',
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

// Generate Interview Questions based on skills - returns string array
function generateQuestions(skills: ExtractedSkills): string[] {
  const skillKeys = [
    ...skills.coreCS,
    ...skills.languages,
    ...skills.web,
    ...skills.data,
    ...skills.cloud,
    ...skills.testing,
    ...skills.other
  ];
  
  const questions: string[] = [];
  
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
    questions.push(genericQuestions[idx]);
  }

  return questions.slice(0, 10);
}

// Known enterprise companies
const ENTERPRISE_COMPANIES = [
  'amazon', 'google', 'microsoft', 'meta', 'apple', 'netflix',
  'infosys', 'tcs', 'wipro', 'accenture', 'capgemini', 'cognizant',
  'ibm', 'oracle', 'salesforce', 'adobe', 'intuit', 'uber', 'lyft',
  'airbnb', 'stripe', 'paypal', 'goldman', 'jp morgan', 'morgan stanley',
  'flipkart', 'swiggy', 'zomato', 'oyo', 'byju', 'cred', 'razorpay',
  'dell', 'hp', 'cisco', 'nvidia', 'intel', 'amd', 'qualcomm'
];

// Company Intel Generation
function generateCompanyIntel(company: string, jdText: string): CompanyIntel | null {
  if (!company || company === 'Not specified') return null;
  
  const lowerCompany = company.toLowerCase();
  const lowerJd = jdText.toLowerCase();
  
  // Determine company size
  let sizeCategory: 'Startup' | 'Mid-size' | 'Enterprise' = 'Startup';
  if (ENTERPRISE_COMPANIES.some(c => lowerCompany.includes(c))) {
    sizeCategory = 'Enterprise';
  }
  
  // Infer industry from JD keywords
  let industry = 'Technology Services';
  if (lowerJd.includes('fintech') || lowerJd.includes('banking') || lowerJd.includes('financial')) {
    industry = 'Financial Services';
  } else if (lowerJd.includes('health') || lowerJd.includes('medical') || lowerJd.includes('pharma')) {
    industry = 'Healthcare Technology';
  } else if (lowerJd.includes('e-commerce') || lowerJd.includes('retail') || lowerJd.includes('shopping')) {
    industry = 'E-Commerce';
  } else if (lowerJd.includes('edtech') || lowerJd.includes('education') || lowerJd.includes('learning')) {
    industry = 'EdTech';
  } else if (lowerJd.includes('logistics') || lowerJd.includes('delivery') || lowerJd.includes('supply')) {
    industry = 'Logistics';
  }
  
  // Hiring focus based on company size
  const hiringFocus = sizeCategory === 'Enterprise' 
    ? 'Structured DSA + Core fundamentals + System design + Strong communication'
    : sizeCategory === 'Startup'
    ? 'Practical problem solving + Stack depth + Ownership + Fast-paced execution'
    : 'Practical problem solving + Full-stack capability + Quick learner + Adaptability';
  
  return {
    company,
    industry,
    sizeCategory,
    hiringFocus
  };
}

// Round Mapping Generation
function generateRoundMapping(companyIntel: CompanyIntel | null, skills: ExtractedSkills): RoundMapping[] {
  const skillKeys = Object.keys(skills).flatMap(k => skills[k] || []);
  const hasDSA = skillKeys.includes('DSA');
  const hasReact = skillKeys.some(s => s.includes('React') || s.includes('Node'));
  const isEnterprise = companyIntel?.sizeCategory === 'Enterprise';
  
  // Enterprise + DSA focused
  if (isEnterprise && hasDSA) {
    return [
      {
        round: 1,
        name: 'Online Assessment',
        description: 'DSA + Aptitude + Logical Reasoning',
        whyItMatters: 'Clears the initial filtering barrier. Strong DSA fundamentals prove problem-solving ability.'
      },
      {
        round: 2,
        name: 'Technical Interview - DSA',
        description: 'Live coding on arrays, trees, graphs, dynamic programming',
        whyItMatters: 'Tests algorithmic thinking and code quality under pressure.'
      },
      {
        round: 3,
        name: 'Technical Interview - Core CS',
        description: 'OOP, DBMS, OS, Networks, System Design basics',
        whyItMatters: 'Validates computer science fundamentals required for the role.'
      },
      {
        round: 4,
        name: 'Managerial + HR',
        description: 'Project discussion, leadership, cultural fit',
        whyItMatters: 'Ensures alignment with team values and growth potential.'
      }
    ];
  }
  
  // Startup + React/Node focused
  if (!isEnterprise && hasReact) {
    return [
      {
        round: 1,
        name: 'Practical Coding',
        description: 'Build a small feature or solve real-world problem',
        whyItMatters: 'Proves you can ship code, not just solve algorithms.'
      },
      {
        round: 2,
        name: 'System Discussion',
        description: 'Architecture decisions, trade-offs, scaling considerations',
        whyItMatters: 'Shows depth in system design and decision making.'
      },
      {
        round: 3,
        name: 'Culture Fit',
        description: 'Team价值观, ownership, rapid learning ability',
        whyItMatters: 'Startup success depends on collaborative, adaptable teammates.'
      }
    ];
  }
  
  // Mid-size or default pattern
  if (hasDSA) {
    return [
      {
        round: 1,
        name: 'Aptitude + Technical Quiz',
        description: 'Quantitative + Logical + Domain basics',
        whyItMatters: 'Tests aptitude and baseline technical knowledge.'
      },
      {
        round: 2,
        name: 'Technical Interview',
        description: 'DSA + Core concepts + Project deep-dive',
        whyItMatters: 'Primary filter for technical competence.'
      },
      {
        round: 3,
        name: 'HR Interview',
        description: 'Background, expectations, cultural fit',
        whyItMatters: 'Final alignment check before offer.'
      }
    ];
  }
  
  // Default fallback
  return [
    {
      round: 1,
      name: 'Screening',
      description: 'Basic technical questions + Resume review',
      whyItMatters: 'Initial evaluation of suitability.'
    },
    {
      round: 2,
      name: 'Technical Round',
      description: 'Core concepts + Problem solving + Projects',
      whyItMatters: 'Deep dive into your technical expertise.'
    },
    {
      round: 3,
      name: 'HR Round',
      description: 'Fit assessment + Compensation discussion',
        whyItMatters: 'Final hurdle before offer extension.'
    }
  ];
}

// Context Provider with localStorage robustness
function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisEntry | null>(null);
  const [history, setHistory] = useState<AnalysisEntry[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Validate entry has required fields
  const isValidEntry = (entry: unknown): entry is AnalysisEntry => {
    if (!entry || typeof entry !== 'object') return false;
    const e = entry as Record<string, unknown>;
    return typeof e.id === 'string' && typeof e.createdAt === 'string';
  };

  useEffect(() => {
    const saved = localStorage.getItem('placementPrepHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validEntries = parsed.filter(isValidEntry);
          if (validEntries.length < parsed.length) {
            setLoadError('One saved entry couldn\'t be loaded. Create a new analysis.');
          }
          setHistory(validEntries);
        }
      } catch (e) {
        console.error('Failed to parse history:', e);
        setLoadError('One saved entry couldn\'t be loaded. Create a new analysis.');
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

  const updateEntry = (id: string, updates: Partial<AnalysisEntry>) => {
    const newHistory = history.map(entry => 
      entry.id === id ? { ...entry, ...updates, updatedAt: new Date().toISOString() } : entry
    );
    setHistory(newHistory);
    localStorage.setItem('placementPrepHistory', JSON.stringify(newHistory));
    
    // Also update currentAnalysis if it matches
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis({ ...currentAnalysis, ...updates, updatedAt: new Date().toISOString() });
    }
  };

  return (
    <AnalysisContext.Provider value={{ currentAnalysis, setCurrentAnalysis, history, addToHistory, deleteFromHistory, updateEntry, loadError }}>
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
  const radarData = [
    { skill: 'Core CS', value: Math.min(skills.coreCS.length * 25, 100), fullMark: 100 },
    { skill: 'Languages', value: Math.min(skills.languages.length * 25, 100), fullMark: 100 },
    { skill: 'Web', value: Math.min(skills.web.length * 25, 100), fullMark: 100 },
    { skill: 'Data', value: Math.min(skills.data.length * 25, 100), fullMark: 100 },
    { skill: 'Cloud', value: Math.min(skills.cloud.length * 25, 100), fullMark: 100 }
  ];

  const hasSkills = radarData.some(d => d.value > 0);
  if (!hasSkills) {
    radarData.forEach(d => d.value = 25);
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

// Analyze Page with validation
function AnalyzePage() {
  const navigate = useNavigate();
  const { addToHistory, setCurrentAnalysis } = useAnalysis();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  const handleAnalyze = () => {
    if (!jdText.trim()) return;

    // Validate JD length
    if (jdText.trim().length < 200) {
      setValidationWarning('This JD is too short to analyze deeply. Paste full JD for better output.');
    } else {
      setValidationWarning(null);
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const extractedSkills = extractSkills(jdText);
      
      const baseScore = calculateReadinessScore(jdText, company, role, extractedSkills);
      const plan7Days = generatePlan(extractedSkills);
      const checklist = generateChecklist(extractedSkills);
      const questions = generateQuestions(extractedSkills);
      const companyIntel = generateCompanyIntel(company, jdText);
      const roundMappingLegacy = generateRoundMapping(companyIntel, extractedSkills);
      
      // Build skillConfidenceMap - default all to "practice"
      const skillConfidenceMap: { [skill: string]: 'know' | 'practice' } = {};
      Object.values(extractedSkills).forEach(skills => {
        skills.forEach(skill => {
          skillConfidenceMap[skill] = 'practice';
        });
      });

      // Map legacy roundMapping to new format
      const roundMapping: RoundMapEntry[] = roundMappingLegacy.map(r => ({
        roundTitle: `Round ${r.round}: ${r.name}`,
        focusAreas: r.description.split(', '),
        whyItMatters: r.whyItMatters
      }));

      const entry: AnalysisEntry = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        company: company || '',
        role: role || '',
        jdText,
        extractedSkills,
        plan7Days,
        checklist,
        questions,
        baseScore,
        finalScore: baseScore,
        skillConfidenceMap,
        companyIntel: companyIntel || undefined,
        roundMapping
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
            <textarea
              value={jdText}
              onChange={(e) => {
                setJdText(e.target.value);
                setValidationWarning(null);
              }}
              placeholder="Paste the job description here..."
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">{jdText.length} characters</p>
              {validationWarning && (
                <p className="text-sm text-amber-600">{validationWarning}</p>
              )}
            </div>
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
  const { currentAnalysis, updateEntry } = useAnalysis();
  const navigate = useNavigate();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

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

  // Handle both legacy and new schema
  const { 
    extractedSkills, 
    baseScore = currentAnalysis.readinessScore || 50, 
    finalScore = currentAnalysis.readinessScore || 50,
    plan7Days = currentAnalysis.plan || [],
    checklist = currentAnalysis.checklistLegacy || [],
    questions = currentAnalysis.questions || [],
    company = currentAnalysis.company || 'Not specified', 
    role = currentAnalysis.role || 'Not specified', 
    id, 
    companyIntel, 
    roundMapping = currentAnalysis.roundMapping || []
  } = currentAnalysis;
  
  // Initialize skillConfidenceMap if not present
  const skillConfidenceMap = currentAnalysis.skillConfidenceMap || {};
  
  // Calculate live readiness score from baseScore
  const calculateLiveScore = () => {
    let score = baseScore;
    Object.values(skillConfidenceMap).forEach(confidence => {
      if (confidence === 'know') score += 2;
      else if (confidence === 'practice') score -= 2;
    });
    return Math.max(0, Math.min(100, score));
  };
  
  const liveScore = calculateLiveScore();

  // Get all skills as flat array
  const allSkills = (
    [
      ...extractedSkills.coreCS.map(s => ({ skill: s, category: 'Core CS' })),
      ...extractedSkills.languages.map(s => ({ skill: s, category: 'Languages' })),
      ...extractedSkills.web.map(s => ({ skill: s, category: 'Web' })),
      ...extractedSkills.data.map(s => ({ skill: s, category: 'Data' })),
      ...extractedSkills.cloud.map(s => ({ skill: s, category: 'Cloud' })),
      ...extractedSkills.testing.map(s => ({ skill: s, category: 'Testing' })),
      ...extractedSkills.other.map(s => ({ skill: s, category: 'Other' }))
    ]
  ).map(s => ({ ...s, confidence: skillConfidenceMap[s.skill] || 'practice' }));

  // Get weak skills (marked as practice)
  const weakSkills = allSkills.filter(s => s.confidence === 'practice').slice(0, 3);

  const handleSkillToggle = (skill: string, confidence: 'know' | 'practice') => {
    const newMap = { ...skillConfidenceMap, [skill]: confidence };
    const newScore = calculateLiveScore();
    updateEntry(id, { 
      skillConfidenceMap: newMap,
      finalScore: newScore
    });
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const exportAsTxt = () => {
    let content = `PLACEMENT PREPARATION ANALYSIS\n`;
    content += `================================\n\n`;
    content += `Company: ${company}\nRole: ${role}\nBase Score: ${baseScore}\nFinal Score: ${liveScore}\n\n`;
    
    // Add Company Intel
    if (companyIntel) {
      content += `COMPANY INTEL\n`;
      content += `-------------\n`;
      content += `Company: ${companyIntel.company}\n`;
      content += `Industry: ${companyIntel.industry}\n`;
      content += `Size: ${companyIntel.sizeCategory}\n`;
      content += `Hiring Focus: ${companyIntel.hiringFocus}\n\n`;
    }
    
    // Add Round Mapping
    if (roundMapping && roundMapping.length > 0) {
      content += `INTERVIEW ROUND MAPPING\n`;
      content += `-----------------------\n`;
      roundMapping.forEach((round, idx) => {
        content += `${round.roundTitle}\n`;
        content += `  Focus: ${round.focusAreas.join(', ')}\n`;
        content += `  Why: ${round.whyItMatters}\n\n`;
      });
    }
    
    content += `SKILLS EXTRACTED\n`;
    content += `----------------\n`;
    content += `Core CS: ${extractedSkills.coreCS.join(', ')}\n`;
    content += `Languages: ${extractedSkills.languages.join(', ')}\n`;
    content += `Web: ${extractedSkills.web.join(', ')}\n`;
    content += `Data: ${extractedSkills.data.join(', ')}\n`;
    content += `Cloud/DevOps: ${extractedSkills.cloud.join(', ')}\n`;
    content += `Testing: ${extractedSkills.testing.join(', ')}\n`;
    content += `Other: ${extractedSkills.other.join(', ')}\n\n`;
    
    content += `7-DAY PREPARATION PLAN\n`;
    content += `----------------------\n`;
    plan7Days.forEach(day => {
      content += `Day ${day.day}: ${day.focus}\n`;
      day.tasks.forEach(task => content += `  - ${task}\n`);
      content += `\n`;
    });
    
    content += `PREPARATION CHECKLIST\n`;
    content += `---------------------\n`;
    checklist.forEach(round => {
      content += `${round.roundTitle}\n`;
      round.items.forEach(item => content += `  □ ${item}\n`);
      content += `\n`;
    });
    
    content += `LIKELY INTERVIEW QUESTIONS\n`;
    content += `-------------------------\n`;
    questions.forEach((q, idx) => content += `${idx + 1}. ${q}\n`);
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-prep-${company.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPlanText = () => {
    let text = `7-DAY PREPARATION PLAN\n`;
    text += `----------------------\n`;
    plan7Days.forEach(day => {
      text += `Day ${day.day}: ${day.focus}\n`;
      day.tasks.forEach(task => text += `  - ${task}\n`);
      text += `\n`;
    });
    return text;
  };

  const getChecklistText = () => {
    let text = `PREPARATION CHECKLIST\n`;
    text += `---------------------\n`;
    checklist.forEach(round => {
      text += `${round.roundTitle}\n`;
      round.items.forEach(item => text += `□ ${item}\n`);
      text += `\n`;
    });
    return text;
  };

  const getQuestionsText = () => {
    let text = `LIKELY INTERVIEW QUESTIONS\n`;
    text += `-------------------------\n`;
    questions.forEach((q, idx) => text += `${idx + 1}. ${q}\n`);
    return text;
  };

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
          <CircularProgress value={liveScore} max={100} />
          <p className="mt-4 text-lg font-medium text-gray-700">Readiness Score</p>
          <p className="text-sm text-gray-500">
            {liveScore > baseScore ? `+${liveScore - baseScore} from self-assessment` : liveScore < baseScore ? `${liveScore - baseScore} from self-assessment` : 'Based on JD analysis'}
          </p>
        </CardContent>
      </Card>

      {/* Company Intel Block */}
      {companyIntel && (
        <Card className="border-indigo-200">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Company Intel</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Company</p>
                <p className="font-semibold text-gray-900">{companyIntel.company}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Industry</p>
                <p className="font-semibold text-gray-900">{companyIntel.industry}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Size Category</p>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  companyIntel.sizeCategory === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                  companyIntel.sizeCategory === 'Mid-size' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {companyIntel.sizeCategory}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 uppercase mb-1">Typical Hiring Focus</p>
              <p className="text-sm text-gray-700">{companyIntel.hiringFocus}</p>
            </div>
            <p className="text-xs text-gray-400 mt-4 italic">Demo Mode: Company intel generated heuristically.</p>
          </CardContent>
        </Card>
      )}

      {/* Round Mapping */}
      {roundMapping && roundMapping.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Interview Round Mapping</h3>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {roundMapping.map((round, idx) => (
                <div key={round.roundTitle} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-700 font-semibold">{idx + 1}</span>
                    </div>
                    {idx < roundMapping.length - 1 && (
                      <div className="w-0.5 h-full bg-indigo-200 absolute top-10 left-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{round.roundTitle}</h4>
                    <p className="text-sm text-indigo-600 mt-0.5">{round.focusAreas.join(', ')}</p>
                    <p className="text-xs text-gray-500 mt-2 italic">{round.whyItMatters}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skill Breakdown with Interactive Toggles */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Key Skills Extracted</h3>
        </CardHeader>
        <CardContent>
          <SkillRadarChart skills={extractedSkills} />
          <div className="mt-6 space-y-4">
            {extractedSkills.coreCS.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Core CS:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {extractedSkills.coreCS.map(skill => {
                    const confidence = skillConfidenceMap[skill] || 'practice';
                    return (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill, confidence === 'know' ? 'practice' : 'know')}
                        className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                          confidence === 'know' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {confidence === 'know' ? '✓ I know this' : '○ Need practice'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {extractedSkills.languages.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Languages:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {extractedSkills.languages.map(skill => {
                    const confidence = skillConfidenceMap[skill] || 'practice';
                    return (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill, confidence === 'know' ? 'practice' : 'know')}
                        className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                          confidence === 'know' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {confidence === 'know' ? '✓ I know this' : '○ Need practice'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {extractedSkills.web.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Web:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {extractedSkills.web.map(skill => {
                    const confidence = skillConfidenceMap[skill] || 'practice';
                    return (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill, confidence === 'know' ? 'practice' : 'know')}
                        className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                          confidence === 'know' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {confidence === 'know' ? '✓ I know this' : '○ Need practice'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {extractedSkills.data.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Data:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {extractedSkills.data.map(skill => {
                    const confidence = skillConfidenceMap[skill] || 'practice';
                    return (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill, confidence === 'know' ? 'practice' : 'know')}
                        className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                          confidence === 'know' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {confidence === 'know' ? '✓ I know this' : '○ Need practice'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {extractedSkills.cloud.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Cloud/DevOps:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {extractedSkills.cloud.map(skill => {
                    const confidence = skillConfidenceMap[skill] || 'practice';
                    return (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill, confidence === 'know' ? 'practice' : 'know')}
                        className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                          confidence === 'know' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {confidence === 'know' ? '✓ I know this' : '○ Need practice'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {extractedSkills.other.length > 0 && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Other:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {extractedSkills.other.map(skill => {
                    const confidence = skillConfidenceMap[skill] || 'practice';
                    return (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill, confidence === 'know' ? 'practice' : 'know')}
                        className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                          confidence === 'know' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {confidence === 'know' ? '✓ I know this' : '○ Need practice'}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Tools */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => copyToClipboard(getPlanText(), 'plan')}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          {copiedSection === 'plan' ? '✓ Copied!' : 'Copy 7-day plan'}
        </button>
        <button
          onClick={() => copyToClipboard(getChecklistText(), 'checklist')}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          {copiedSection === 'checklist' ? '✓ Copied!' : 'Copy round checklist'}
        </button>
        <button
          onClick={() => copyToClipboard(getQuestionsText(), 'questions')}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          {copiedSection === 'questions' ? '✓ Copied!' : 'Copy 10 questions'}
        </button>
        <button
          onClick={exportAsTxt}
          className="px-4 py-2 text-sm bg-[hsl(245,58%,51%)] text-white rounded-lg hover:bg-[hsl(245,58%,45%)] transition-colors flex items-center gap-2"
        >
          Download as TXT
        </button>
      </div>

      {/* 7-Day Plan */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">7-Day Preparation Plan</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plan7Days.map(day => (
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
            {checklist.map((round, idx) => (
              <div key={idx}>
                <h4 className="font-medium text-gray-900 mb-2">{round.roundTitle}</h4>
                <div className="space-y-2">
                  {round.items.map((item, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer">
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
                  <p className="text-gray-900">{q}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Next Box */}
      <Card className="border-indigo-200 bg-indigo-50">
        <CardContent className="py-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Action Next</h4>
          {weakSkills.length > 0 ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Focus on these skills that need practice:
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {weakSkills.map(({ skill }) => (
                  <span key={skill} className="px-3 py-1 bg-amber-100 text-amber-700 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
              <button className="w-full py-3 bg-[hsl(245,58%,51%)] hover:bg-[hsl(245,58%,45%)] text-white rounded-lg font-medium transition-colors">
                Start Day 1 plan now
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-green-600 font-medium mb-2">Great job! You've marked all skills as known.</p>
              <p className="text-sm text-gray-600">Keep practicing to maintain your skills.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// History Page
function HistoryPage() {
  const { history, deleteFromHistory, setCurrentAnalysis, loadError } = useAnalysis();
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

      {loadError && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-700 text-sm">
          {loadError}
        </div>
      )}

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
                      <h3 className="font-medium text-gray-900">{entry.company || 'Not specified'}</h3>
                      <p className="text-sm text-gray-500">{entry.role || 'Not specified'}</p>
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
                    <div className="text-2xl font-bold text-indigo-600">{entry.finalScore || entry.baseScore || 50}</div>
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
            <SkillRadarChart skills={{ coreCS: ['DSA', 'OOP'], languages: ['Java'], web: ['React', 'Node'], data: ['SQL'], cloud: [], testing: [], other: [] }} />
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
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-indigo-50 to-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Ace Your Placement</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Practice, assess, and prepare for your dream job
          </p>
          <Link to="/dashboard" className="bg-[hsl(245,58%,51%)] hover:bg-[hsl(245,58%,45%)] text-white px-8 py-3 rounded-lg font-medium transition-colors inline-block">
            Get Started
          </Link>
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
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
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
      <p className="text-gray resources coming soon-600">Learning</p>
    </div>
  );
}

// Test Checklist Page
interface TestItem {
  id: number;
  label: string;
  hint: string;
}

const TEST_ITEMS: TestItem[] = [
  { id: 1, label: 'JD required validation works', hint: 'Try submitting empty JD form' },
  { id: 2, label: 'Short JD warning shows for <200 chars', hint: 'Enter JD with <200 characters' },
  { id: 3, label: 'Skills extraction groups correctly', hint: 'Analyze JD with React, DSA, SQL' },
  { id: 4, label: 'Round mapping changes based on company + skills', hint: 'Test with Amazon vs unknown startup' },
  { id: 5, label: 'Score calculation is deterministic', hint: 'Same input should give same score' },
  { id: 6, label: 'Skill toggles update score live', hint: 'Toggle skills and watch score change' },
  { id: 7, label: 'Changes persist after refresh', hint: 'Toggle skills, refresh, verify persisted' },
  { id: 8, label: 'History saves and loads correctly', hint: 'Analyze JD, check history page' },
  { id: 9, label: 'Export buttons copy the correct content', hint: 'Click export buttons and paste' },
  { id: 10, label: 'No console errors on core pages', hint: 'Check browser DevTools console' },
];

function TestChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('testChecklist');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load checklist');
      }
    }
  }, []);

  const toggleItem = (id: number) => {
    let newChecked: number[];
    if (checkedItems.includes(id)) {
      newChecked = checkedItems.filter(item => item !== id);
    } else {
      newChecked = [...checkedItems, id];
    }
    setCheckedItems(newChecked);
    localStorage.setItem('testChecklist', JSON.stringify(newChecked));
  };

  const resetChecklist = () => {
    setCheckedItems([]);
    localStorage.setItem('testChecklist', JSON.stringify([]));
  };

  const passedCount = checkedItems.length;
  const allPassed = passedCount === 10;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Summary */}
        <Card className="mb-6">
          <CardContent className="py-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tests Passed: {passedCount} / 10
              </h2>
              {!allPassed && (
                <p className="text-amber-600 font-medium">
                  Fix issues before shipping.
                </p>
              )}
              {allPassed && (
                <p className="text-green-600 font-medium">
                  All tests passed! Ready to ship.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Items */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Test Checklist</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {TEST_ITEMS.map(item => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={checkedItems.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                  className="w-5 h-5 mt-0.5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <label className="font-medium text-gray-900 cursor-pointer">
                    {item.label}
                  </label>
                  <p className="text-sm text-gray-500 mt-0.5">How to test: {item.hint}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={resetChecklist}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Reset Checklist
          </button>
          <Link
            to="/prp/08-ship"
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              allPassed
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none'
            }`}
          >
            Go to Ship
          </Link>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link to="/dashboard" className="text-indigo-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

// Ship Locked Page
function ShipLockedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md">
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ship Locked</h2>
          <p className="text-gray-600 mb-6">
            Complete all 10 tests before shipping.
          </p>
          <Link
            to="/prp/07-test"
            className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Go to Tests
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

// Ship Ready Page
function ShipReadyPage() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('testChecklist');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load checklist');
      }
    }
  }, []);

  useEffect(() => {
    if (checkedItems.length !== 10) {
      navigate('/prp/08-ship-locked');
    }
  }, [checkedItems, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
      <Card className="max-w-lg">
        <CardContent className="py-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🚀</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Ready to Ship!</h2>
          <p className="text-gray-600 mb-6">
            All tests passed. Your Placement Readiness Platform is ready for production.
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Go to Dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

// Ship Locked Redirector (used in route)
function ShipLockedRedirect() {
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('testChecklist');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load checklist');
      }
    }
  }, []);

  useEffect(() => {
    if (checkedItems.length === 10) {
      navigate('/prp/08-ship');
    }
  }, [checkedItems, navigate]);

  return <ShipLockedPage />;
}

// Main App

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
          <Route path="/prp/07-test" element={<TestChecklistPage />} />
          <Route path="/prp/08-ship-locked" element={<ShipLockedRedirect />} />
          <Route path="/prp/08-ship" element={<ShipReadyPage />} />
        </Routes>
      </BrowserRouter>
    </AnalysisProvider>
  );
}

export default App;
