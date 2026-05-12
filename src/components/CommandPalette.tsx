import { useState, useEffect, useCallback } from 'react';
import { Search, Command, Film, Music, BookOpen, Calculator, Calendar, History, ArrowRight, X, Loader2, FileText, CheckCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { movieService } from '../services/movieService';
import { searchCollections } from '../services/firebaseService';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'movie' | 'music' | 'navigation' | 'note' | 'task' | 'skill';
  path?: string;
  icon: any;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        closePalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closePalette]);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Hardcoded navigation results
    const navItems: SearchResult[] = [
      { id: 'nav-home', title: 'Go to Dashboard', subtitle: 'Overview', type: 'navigation', path: '/', icon: History },
      { id: 'nav-cinema', title: 'Open Cinema', subtitle: 'Movies & Series', type: 'navigation', path: '/cinema', icon: Film },
      { id: 'nav-sound', title: 'Open Sound', subtitle: 'Music & Ambience', type: 'navigation', path: '/sound', icon: Music },
      { id: 'nav-library', title: 'Open Library', subtitle: 'Notes & Thoughts', type: 'navigation', path: '/notes', icon: BookOpen },
    ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

    try {
      // Async Multi Search
      const [movieData, firebaseData] = await Promise.all([
        movieService.searchMulti(searchQuery),
        searchCollections(searchQuery)
      ]);

      const movieResults: SearchResult[] = (movieData?.results?.slice(0, 5) || []).map((m: any) => ({
        id: `movie-${m.id}`,
        title: m.title || m.name,
        subtitle: m.media_type === 'movie' ? 'Movie' : 'TV Show',
        type: 'movie',
        icon: Film,
        path: '/cinema'
      }));

      const firebaseResults: SearchResult[] = firebaseData.map((item: any) => {
        let type: SearchResult['type'] = 'note';
        let icon = FileText;
        let path = '/notes';

        if (item._collection === 'tasks') {
          type = 'task';
          icon = CheckCircle;
          path = '/planning';
        } else if (item._collection === 'growth_areas') {
          type = 'skill';
          icon = Zap;
          path = '/skills';
        }

        return {
          id: `${item._collection}-${item.id}`,
          title: item.title || item.name,
          subtitle: item.summary || item.category || 'Entry',
          type,
          icon,
          path
        };
      });

      setResults([...navItems, ...firebaseResults, ...movieResults]);
    } catch (error) {
      console.error("Palette search failed:", error);
      setResults(navItems);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  const handleSelect = (result: SearchResult) => {
    if (result.path) {
      navigate(result.path);
    } else if (result.type === 'movie') {
      navigate('/cinema');
    }
    closePalette();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePalette}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl shadow-black/20 overflow-hidden relative border border-outline/10"
          >
            <div className="flex items-center px-10 py-8 gap-6 border-b border-outline/5 bg-surface-dim/50">
              <div className="bg-primary/10 p-3 rounded-2xl">
                 <Command size={24} className="text-primary" />
              </div>
              <input 
                autoFocus
                type="text" 
                placeholder="Search anything in Loom..." 
                className="flex-1 bg-transparent border-none focus:ring-0 font-display text-2xl font-bold italic placeholder:opacity-20 text-on-surface outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {isSearching ? (
                <Loader2 size={24} className="animate-spin text-primary opacity-40" />
              ) : (
                <div className="hidden sm:flex items-center gap-2 bg-on-surface/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-40">
                  <span>esc</span>
                </div>
              )}
            </div>

            <div className="max-h-[500px] overflow-y-auto p-4 md:p-6 space-y-2">
              {results.length > 0 ? (
                results.map((result, index) => (
                  <button 
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-6 p-6 rounded-3xl transition-all text-left group ${
                      selectedIndex === index ? 'bg-primary/5 shadow-sm' : 'hover:bg-on-surface/5'
                    }`}
                  >
                    <div className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-colors ${
                      selectedIndex === index ? 'bg-primary text-on-primary' : 'bg-on-surface/5 text-on-surface/60'
                    }`}>
                       <result.icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="font-display text-lg font-bold italic tracking-tight">{result.title}</p>
                        <span className="font-sans text-[8px] font-black uppercase tracking-widest bg-on-surface/5 px-2 py-0.5 rounded-full opacity-40">{result.type}</span>
                      </div>
                      <p className="font-sans text-xs opacity-40 truncate">{result.subtitle}</p>
                    </div>
                    <ArrowRight size={18} className={`transition-all ${
                      selectedIndex === index ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    }`} />
                  </button>
                ))
              ) : query ? (
                 <div className="py-20 text-center space-y-6">
                    <div className="w-16 h-16 bg-on-surface/5 rounded-3xl flex items-center justify-center mx-auto">
                       <X className="text-on-surface/20" />
                    </div>
                    <div>
                       <p className="font-display text-xl font-bold italic opacity-40">No records found for that frequency.</p>
                       <p className="font-sans text-xs opacity-20">Try searching for movies, tasks, or pages.</p>
                    </div>
                 </div>
              ) : (
                <div className="p-4 space-y-6">
                  <span className="font-sans text-[10px] font-black uppercase tracking-widest opacity-30 block px-4">Instant Navigation</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {[
                       { icon: BookOpen, label: 'Deep Focus', path: '/focus' },
                       { icon: Calculator, label: 'Skill Matrix', path: '/skills' },
                       { icon: Inbox, label: 'Library', path: '/notes' },
                       { icon: Calendar, label: 'Intentions', path: '/planning' }
                     ].map((item) => (
                       <button 
                         key={item.label}
                         onClick={() => { navigate(item.path); closePalette(); }}
                         className="flex items-center gap-4 p-5 bg-on-surface/5 hover:bg-primary/5 hover:text-primary rounded-3xl transition-all text-left group"
                       >
                         <item.icon size={18} strokeWidth={1.5} className="opacity-40 group-hover:opacity-100" />
                         <span className="font-display font-bold italic">{item.label}</span>
                       </button>
                     ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-surface-dim/80 backdrop-blur-xl border-t border-outline/5 px-10 py-5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-40">
               <div className="flex gap-6">
                 <span className="flex items-center gap-2 italic"><span className="bg-on-surface/10 px-1 rounded">↵</span> Select</span>
                 <span className="flex items-center gap-2 italic"><span className="bg-on-surface/10 px-1 rounded">↑↓</span> Navigate</span>
               </div>
               <span className="italic">Loom Index V1.0</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
