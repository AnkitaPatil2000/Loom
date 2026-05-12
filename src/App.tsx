/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import QuickCaptureModal from './components/QuickCaptureModal';
import Today from './pages/Today';
import Library from './pages/Library';
import Preferences from './pages/Preferences';
import Callback from './pages/Callback';
import { useUser } from './context/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import { useLoomStore } from './hooks/useLoomStore';

function AppContent() {
  const { user, loading } = useUser();
  const { isLoaded } = useLoomStore();
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-serif text-5xl font-bold italic text-ink-900"
        >
          loom.
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex text-ink-900 selection:bg-rose-200/50 selection:text-ink-900">
      <Sidebar onReflect={() => setIsCaptureOpen(true)} />
      <QuickCaptureModal isOpen={isCaptureOpen} onClose={() => setIsCaptureOpen(false)} />
      <div className="flex-1 ml-[var(--spacing-sidebar)] min-h-screen flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/library" element={<Library />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/callback" element={<Callback />} />
          </Routes>
        </main>
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
