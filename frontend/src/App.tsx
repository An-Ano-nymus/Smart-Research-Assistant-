import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Upload from './components/Upload';
import AskAnything from './components/AskAnything';
import ChallengeMe from './components/ChallengeMe';
import { DocumentProvider } from './context/DocumentContext';

function App() {
  const [isDark, setIsDark] = useState(() => {
    // load preference from localStorage or system
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <DocumentProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-colors duration-300">
          <Navigation isDark={isDark} setIsDark={setIsDark} />
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/ask" element={<AskAnything />} />
            <Route path="/challenge" element={<ChallengeMe />} />
          </Routes>
        </div>
      </Router>
    </DocumentProvider>
  );
}

export default App;
