import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Code, Video, TrendingUp, LayoutDashboard, BookOpen, ClipboardCheck, FolderOpen, User } from 'lucide-react';

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
          {/* Placeholder content - Outlet would go here */}
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to Dashboard</h2>
            <p className="text-gray-600">Select a section from the sidebar to get started</p>
          </div>
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
