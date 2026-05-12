/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopAppBar from './components/TopAppBar';
import CommandCenter from './pages/CommandCenter';
import FocusLedger from './pages/FocusLedger';
import SkillsTracker from './pages/SkillsTracker';
import NotesVault from './pages/NotesVault';
import Planning from './pages/Planning';
import Journal from './pages/Journal';
import Cinema from './pages/Cinema';
import Sound from './pages/Sound';
import Login from './pages/Login';
import { useUser } from './context/UserContext';
import { motion } from 'motion/react';

// Lazy load or import other pages once created
// For now, let's use placeholders for other pages to avoid compilation errors
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
    <span className="font-mono text-[10px] text-primary uppercase tracking-[0.4em] mb-4">Archive Section</span>
    <h2 className="font-display text-5xl font-bold tracking-tight italic mb-8 mx-auto max-w-2xl">{title} is being restored.</h2>
    <div className="w-48 h-[1px] bg-outline-variant relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/40 animate-pulse"></div>
    </div>
    <p className="mt-8 text-on-surface-variant font-sans text-xs uppercase tracking-[0.2em] opacity-50 italic">Digital sediment is settling...</p>
  </div>
);

function AppContent() {
  const location = useLocation();
  const { user, loading } = useUser();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center paper-texture bg-surface">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-display text-4xl font-bold italic text-primary"
        >
          loom.
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }
  
  const getTitle = (pathname: string) => {
    switch (pathname) {
      case '/': return 'Home';
      case '/focus': return 'Flow';
      case '/skills': return 'Growth';
      case '/planning': return 'Intentions';
      case '/notes': return 'Library';
      case '/reflection': return 'Journal';
      case '/cinema': return 'Cinema';
      case '/sound': return 'Sound';
      default: return 'Loom';
    }
  };

  return (
    <div className="min-h-screen flex text-on-background paper-texture selection:bg-primary/20 selection:text-primary">
      <Sidebar />
      <div className="flex-1 ml-[var(--spacing-sidebar)] flex flex-col min-h-screen">
        <TopAppBar title={getTitle(location.pathname)} />
        <main className="flex-1 mt-20 pb-20 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/focus" element={<FocusLedger />} />
            <Route path="/skills" element={<SkillsTracker />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/notes" element={<NotesVault />} />
            <Route path="/reflection" element={<Journal />} />
            <Route path="/cinema" element={<Cinema />} />
            <Route path="/sound" element={<Sound />} />
          </Routes>
        </main>
        
        <footer className="fixed bottom-0 right-0 w-[calc(100%-var(--spacing-sidebar))] h-12 bg-background/80 border-t border-outline flex justify-between items-center px-16 z-40 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
            <span className="font-sans text-[10px] font-medium tracking-tight text-on-surface-variant">Loom is in sync.</span>
          </div>
          <div className="flex items-center gap-12 font-sans text-[10px] font-medium text-on-surface-variant/60">
            <span className="hover:text-primary transition-colors cursor-pointer italic">Clarity through precision.</span>
            <span className="hover:text-primary transition-colors cursor-pointer tracking-widest">v2.1.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
