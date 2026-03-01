import { useState } from 'react';
import './design-system.css';
import './App.css';

interface TestCategory {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  completed: number;
  icon: string;
}

interface CodingChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  completed: boolean;
}

interface MockTest {
  id: string;
  company: string;
  date: string;
  status: 'Upcoming' | 'Completed' | 'Attempted';
  score?: number;
}

const categories: TestCategory[] = [
  { id: 'aptitude', name: 'Quantitative Aptitude', description: 'Numbers, algebra, percentages, profit & loss', questionCount: 250, completed: 87, icon: '∫' },
  { id: 'logical', name: 'Logical Reasoning', description: 'Puzzles, coding-decoding, syllogisms', questionCount: 180, completed: 42, icon: '◈' },
  { id: 'verbal', name: 'Verbal Ability', description: 'Grammar, reading comprehension, vocabulary', questionCount: 200, completed: 65, icon: '◐' },
  { id: 'dsa', name: 'Data Structures & Algorithms', description: 'Arrays, linked lists, trees, graphs', questionCount: 150, completed: 28, icon: '⬡' },
  { id: 'dbms', name: 'Database Management', description: 'SQL, normalization, transactions', questionCount: 100, completed: 55, icon: '⬢' },
  { id: 'os', name: 'Operating Systems', description: 'Processes, memory management, deadlock', questionCount: 80, completed: 34, icon: '◎' },
];

const codingChallenges: CodingChallenge[] = [
  { id: '1', title: 'Two Sum', difficulty: 'Easy', category: 'Arrays', completed: true },
  { id: '2', title: 'Reverse Linked List', difficulty: 'Easy', category: 'Linked List', completed: true },
  { id: '3', title: 'Valid Parentheses', difficulty: 'Easy', category: 'Stacks', completed: false },
  { id: '4', title: 'Merge Intervals', difficulty: 'Medium', category: 'Arrays', completed: false },
  { id: '5', title: 'LRU Cache', difficulty: 'Hard', category: 'Design', completed: false },
];

const mockTests: MockTest[] = [
  { id: '1', company: 'TCS Ninja', date: '2024-03-15', status: 'Upcoming' },
  { id: '2', company: 'Infosys Specialist', date: '2024-03-20', status: 'Upcoming' },
  { id: '3', company: 'Wipro Elite', date: '2024-02-28', status: 'Attempted', score: 72 },
  { id: '4', company: 'Accenture AMHE', date: '2024-02-15', status: 'Completed', score: 85 },
];

type Page = 'dashboard' | 'aptitude' | 'logical' | 'verbal' | 'technical' | 'coding' | 'companies' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [currentStep] = useState(2);
  const [status] = useState<'not-started' | 'in-progress' | 'shipped'>('in-progress');

  const renderSidebar = () => (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">◆</span>
        <span>KodNest</span>
      </div>
      <nav className="sidebar__nav">
        <button 
          className={`sidebar__item ${currentPage === 'dashboard' ? 'sidebar__item--active' : ''}`}
          onClick={() => setCurrentPage('dashboard')}
        >
          <span className="sidebar__icon">◉</span>
          <span>Dashboard</span>
        </button>
        <div className="sidebar__section">
          <div className="sidebar__label">Practice</div>
          <button 
            className={`sidebar__item ${currentPage === 'aptitude' ? 'sidebar__item--active' : ''}`}
            onClick={() => setCurrentPage('aptitude')}
          >
            <span className="sidebar__icon">∫</span>
            <span>Aptitude</span>
          </button>
          <button 
            className={`sidebar__item ${currentPage === 'logical' ? 'sidebar__item--active' : ''}`}
            onClick={() => setCurrentPage('logical')}
          >
            <span className="sidebar__icon">◈</span>
            <span>Logical</span>
          </button>
          <button 
            className={`sidebar__item ${currentPage === 'verbal' ? 'sidebar__item--active' : ''}`}
            onClick={() => setCurrentPage('verbal')}
          >
            <span className="sidebar__icon">◐</span>
            <span>Verbal</span>
          </button>
          <button 
            className={`sidebar__item ${currentPage === 'technical' ? 'sidebar__item--active' : ''}`}
            onClick={() => setCurrentPage('technical')}
          >
            <span className="sidebar__icon">⬡</span>
            <span>Technical</span>
          </button>
          <button 
            className={`sidebar__item ${currentPage === 'coding' ? 'sidebar__item--active' : ''}`}
            onClick={() => setCurrentPage('coding')}
          >
            <span className="sidebar__icon">&lt;/&gt;</span>
            <span>Coding</span>
          </button>
        </div>
        <div className="sidebar__section">
          <div className="sidebar__label">Prepare</div>
          <button 
            className={`sidebar__item ${currentPage === 'companies' ? 'sidebar__item--active' : ''}`}
            onClick={() => setCurrentPage('companies')}
          >
            <span className="sidebar__icon">◇</span>
            <span>Companies</span>
          </button>
        </div>
        <div className="sidebar__section">
          <div className="sidebar__label">Account</div>
          <button 
            className={`sidebar__item ${currentPage === 'profile' ? 'sidebar__item--active' : ''}`}
            onClick={() => setCurrentPage('profile')}
          >
            <span className="sidebar__icon">○</span>
            <span>Profile</span>
          </button>
        </div>
      </nav>
    </aside>
  );

  const renderDashboard = () => (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1>Welcome back, Student</h1>
          <p>Continue your placement preparation journey</p>
        </div>
        <div className="dashboard__streak">
          <span className="streak__icon">🔥</span>
          <span className="streak__count">7</span>
          <span className="streak__label">day streak</span>
        </div>
      </div>

      <div className="dashboard__stats">
        <div className="stat-card">
          <div className="stat-card__value">311</div>
          <div className="stat-card__label">Questions Solved</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">72%</div>
          <div className="stat-card__label">Average Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">5</div>
          <div className="stat-card__label">Mock Tests</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">2</div>
          <div className="stat-card__label">Companies Applied</div>
        </div>
      </div>

      <section className="dashboard__section">
        <div className="section-header">
          <h2>Continue Learning</h2>
          <button className="btn btn--ghost btn--small">View All</button>
        </div>
        <div className="category-grid">
          {categories.slice(0, 4).map(cat => (
            <div key={cat.id} className="category-card" onClick={() => setCurrentPage(cat.id as Page)}>
              <div className="category-card__icon">{cat.icon}</div>
              <div className="category-card__content">
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
                <div className="category-card__progress">
                  <div className="progress-bar">
                    <div className="progress-bar__fill" style={{ width: `${(cat.completed / cat.questionCount) * 100}%` }}></div>
                  </div>
                  <span>{cat.completed}/{cat.questionCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard__section">
        <div className="section-header">
          <h2>Upcoming Mock Tests</h2>
          <button className="btn btn--ghost btn--small">View All</button>
        </div>
        <div className="mock-test-list">
          {mockTests.filter(t => t.status !== 'Completed').map(test => (
            <div key={test.id} className="mock-test-card">
              <div className="mock-test-card__info">
                <h4>{test.company}</h4>
                <span className="mock-test-card__date">{test.date}</span>
              </div>
              <span className={`badge badge--${test.status === 'Upcoming' ? 'warning' : 'success'}`}>
                {test.status}
              </span>
              {test.score && <span className="mock-test-card__score">{test.score}%</span>}
              <button className="btn btn--primary btn--small">Practice</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderAptitude = () => (
    <div className="practice-page">
      <div className="page-header">
        <h1>Quantitative Aptitude</h1>
        <p>Master numerical ability and problem-solving skills</p>
      </div>
      
      <div className="topic-list">
        {[
          { name: 'Number Systems', questions: 30, completed: 18 },
          { name: 'Percentages', questions: 25, completed: 12 },
          { name: 'Profit & Loss', questions: 28, completed: 8 },
          { name: 'Time & Work', questions: 22, completed: 15 },
          { name: 'Ratio & Proportion', questions: 20, completed: 20 },
          { name: 'Averages', questions: 18, completed: 14 },
        ].map((topic, idx) => (
          <div key={idx} className="topic-card">
            <div className="topic-card__info">
              <h4>{topic.name}</h4>
              <span>{topic.completed}/{topic.questions} solved</span>
            </div>
            <div className="topic-card__progress">
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${(topic.completed / topic.questions) * 100}%` }}></div>
              </div>
            </div>
            <button className="btn btn--secondary btn--small">Continue</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCoding = () => (
    <div className="practice-page">
      <div className="page-header">
        <h1>Coding Practice</h1>
        <p>Sharpen your programming skills</p>
      </div>

      <div className="coding-challenge-list">
        {codingChallenges.map(challenge => (
          <div key={challenge.id} className="challenge-card">
            <div className="challenge-card__status">
              {challenge.completed ? '✓' : '○'}
            </div>
            <div className="challenge-card__info">
              <h4>{challenge.title}</h4>
              <div className="challenge-card__meta">
                <span className={`difficulty difficulty--${challenge.difficulty.toLowerCase()}`}>
                  {challenge.difficulty}
                </span>
                <span className="category">{challenge.category}</span>
              </div>
            </div>
            <button className={`btn btn--${challenge.completed ? 'secondary' : 'primary'} btn--small`}>
              {challenge.completed ? 'Review' : 'Solve'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompanies = () => (
    <div className="practice-page">
      <div className="page-header">
        <h1>Company Preparation</h1>
        <p>Prepare for specific company tests</p>
      </div>

      <div className="company-grid">
        {[
          { name: 'TCS', tests: 12, logo: 'T' },
          { name: 'Infosys', tests: 8, logo: 'I' },
          { name: 'Wipro', tests: 10, logo: 'W' },
          { name: 'Accenture', tests: 6, logo: 'A' },
          { name: 'Capgemini', tests: 7, logo: 'C' },
          { name: 'Cognizant', tests: 9, logo: 'C' },
        ].map(company => (
          <div key={company.name} className="company-card">
            <div className="company-card__logo">{company.logo}</div>
            <h4>{company.name}</h4>
            <p>{company.tests} mock tests</p>
            <button className="btn btn--secondary btn--small">Prepare</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboard();
      case 'aptitude':
      case 'logical':
      case 'verbal':
      case 'technical':
        return renderAptitude();
      case 'coding':
        return renderCoding();
      case 'companies':
        return renderCompanies();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="app">
      {renderSidebar()}
      
      <main className="main">
        <header className="top-bar">
          <div className="top-bar__brand">KodNest</div>
          <div className="top-bar__progress">Step {currentStep} / 5</div>
          <div className={`top-bar__status top-bar__status--${status}`}>
            {status === 'not-started' ? 'Not Started' : status === 'in-progress' ? 'In Progress' : 'Shipped'}
          </div>
        </header>

        <div className="main-content">
          {renderContent()}
        </div>

        <footer className="proof-footer">
          <div className="proof-footer__inner">
            <div className="proof-footer__title">Proof Checklist</div>
            <div className="proof-footer__checklist">
              <div className="proof-item">
                <input type="checkbox" className="proof-item__checkbox" id="proof1" defaultChecked />
                <label className="proof-item__label" htmlFor="proof1">UI Built</label>
                <input type="text" className="proof-item__input" placeholder="Screenshot or link..." />
              </div>
              <div className="proof-item">
                <input type="checkbox" className="proof-item__checkbox" id="proof2" />
                <label className="proof-item__label" htmlFor="proof2">Logic Working</label>
                <input type="text" className="proof-item__input" placeholder="Test results..." />
              </div>
              <div className="proof-item">
                <input type="checkbox" className="proof-item__checkbox" id="proof3" />
                <label className="proof-item__label" htmlFor="proof3">Test Passed</label>
                <input type="text" className="proof-item__input" placeholder="Test output..." />
              </div>
              <div className="proof-item">
                <input type="checkbox" className="proof-item__checkbox" id="proof4" />
                <label className="proof-item__label" htmlFor="proof4">Deployed</label>
                <input type="text" className="proof-item__input" placeholder="Live URL..." />
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
