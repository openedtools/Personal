import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import TaxonomyBrowser from './pages/TaxonomyBrowser';
import QuizSetup from './pages/QuizSetup';
import QuizRunner from './pages/QuizRunner';
import ReviewReport from './pages/ReviewReport';
import MistakeJournal from './pages/MistakeJournal';
import Resources from './pages/Resources';
import Settings from './pages/Settings';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="flex flex-col md:flex-row h-full min-h-screen bg-slate-900 text-slate-100">
          {/* Navigation layout */}
          <BottomNav />
          
          {/* Main workspace container */}
          <main className="flex-1 overflow-y-auto px-4 py-6 md:pl-72 md:pr-8 md:py-8 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/objectives" element={<TaxonomyBrowser />} />
              <Route path="/quiz" element={<QuizSetup />} />
              <Route path="/quiz-runner" element={<QuizRunner />} />
              <Route path="/review/:sessionId" element={<ReviewReport />} />
              <Route path="/journal" element={<MistakeJournal />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
