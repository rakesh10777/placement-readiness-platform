import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Code, Video, TrendingUp, LayoutDashboard, BookOpen, ClipboardCheck, FolderOpen, User, ChevronRight } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Radar } from 'recharts';

// Card component (shadcn/ui style)
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
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        {/* Progress circle */}
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
function SkillRadarChart() {
  const data = [
    { skill: 'DSA', value: 75, fullMark: 100 },
    { skill: 'System Design', value: 60, fullMark: 100 },
    { skill: 'Communication', value: 80, fullMark: 100 },
    { skill: 'Resume', value: 85, fullMark: 100 },
    { skill: 'Aptitude', value: 70, fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="skill" tick={{ fill: '#6b7280', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Skills"
          dataKey="value"
          stroke="hsl(245, 58%, 51%)"
          fill="hsl(245, 58%, 51%)"
          fillOpacity={0.3}
        />
      </RadarChart>
    </ResponsiveContainer>
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
            <div
              className="h-full bg-[hsl(245,58%,51%)] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
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
  const activity = [true, true, false, true, true, false, true]; // Days with activity
  
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
            <div
              className="h-full bg-[hsl(245,58%,51%)] rounded-full transition-all duration-500"
              style={{ width: '60%' }}
            />
          </div>
        </div>
        <div className="flex justify-between">
          {days.map((day, index) => (
            <div key={day} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  activity[index]
                    ? 'bg-[hsl(245,58%,51%)] text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
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
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
          >
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

      {/* 2-column grid on desktop, single column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Readiness */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Overall Readiness</h3>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CircularProgress value={72} max={100} />
            <p className="mt-4 text-sm text-gray-500">Readiness Score</p>
          </CardContent>
        </Card>

        {/* Skill Breakdown */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Skill Breakdown</h3>
          </CardHeader>
          <CardContent>
            <SkillRadarChart />
          </CardContent>
        </Card>

        {/* Continue Practice */}
        <ContinuePractice />

        {/* Weekly Goals */}
        <WeeklyGoals />

        {/* Upcoming Assessments - spans full width on mobile, half on desktop */}
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
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Ace Your Placement</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Practice, assess, and prepare for your dream job
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-[hsl(245,58%,51%)] hover:bg-[hsl(245,58%,45%)] text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Grid */}
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

      {/* Footer */}
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="practice" element={<PracticePage />} />
          <Route path="assessments" element={<AssessmentsPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
