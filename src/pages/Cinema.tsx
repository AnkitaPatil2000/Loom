import { useState, useEffect } from 'react';
import { Film, Play, Eye, Share2, Sparkles, Filter, Download, Maximize2, Search, Plus, Star, MessageSquare, Quote, Calendar, Bookmark, History, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { movieService } from '../services/movieService';
import { useAtmosphere } from '../hooks/useAtmosphere';

interface LogEntry {
  id: string;
  tmdbId: number;
  title: string;
  posterPath: string;
  rating: number;
  note: string;
  quote?: string;
  date: string;
  mood: string;
}

const initialScenes = [
  { id: '1', title: 'Midnight Library', intensity: 'Cozy', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000' },
  { id: '2', title: 'Cyberpunk Zen Garden', intensity: 'Electric', url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=2000' },
  { id: '3', title: 'Tuscan Morning', intensity: 'Soft', url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2000' },
  { id: '4', title: 'Rainy Tokyo Alley', intensity: 'Deep', url: 'https://images.unsplash.com/photo-1503891450247-ee5f8bbaf7ef?auto=format&fit=crop&q=80&w=2000' },
];

export default function Cinema() {
  const [scenes, setScenes] = useState(initialScenes);
  const [selectedScene, setSelectedScene] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Archive State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showLogModal, setShowLogModal] = useState<any>(null);

  const atmosphere = useAtmosphere(
    selectedScene?.url || (logs[0]?.posterPath ? `https://image.tmdb.org/t/p/w500${logs[0].posterPath}` : undefined),
    selectedScene ? 'cinematic' : undefined
  );

  useEffect(() => {
    const savedLogs = localStorage.getItem('loom_cinema_logs');
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  const saveLog = (log: LogEntry) => {
    const newLogs = [log, ...logs];
    setLogs(newLogs);
    localStorage.setItem('loom_cinema_logs', JSON.stringify(newLogs));
    setShowLogModal(null);
    setSearchResults([]);
    setSearchQuery('');
  };

  const deleteLog = (id: string) => {
    const newLogs = logs.filter(l => l.id !== id);
    setLogs(newLogs);
    localStorage.setItem('loom_cinema_logs', JSON.stringify(newLogs));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const data = await movieService.searchMovies(searchQuery);
    setSearchResults(data?.results?.slice(0, 5) || []);
    setIsSearching(false);
  };

  const generateNewAtmosphere = () => {
    setIsGenerating(true);
    setTimeout(() => {
        const newScene = {
            id: Date.now().toString(),
            title: 'Generated Ethereal Plain',
            intensity: 'Unique',
            url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000'
        };
        setScenes([newScene, ...scenes]);
        setIsGenerating(false);
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-8 py-12 space-y-32"
      style={{
        background: `radial-gradient(circle at 50% -20%, ${atmosphere.glow}, transparent 60%)`,
        transition: 'background 2s ease-in-out'
      }}
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-3">
           <span className="font-sans text-xs font-black text-primary tracking-[0.3em] uppercase opacity-40 block">Visual Resonator</span>
           <h1 className="font-display text-7xl md:text-8xl font-bold italic text-on-background tracking-tighter leading-[0.85]">Cinema.</h1>
           <p className="font-display text-xl text-on-surface-variant italic opacity-60 max-w-lg leading-relaxed">Architecting the visual background for your mind.</p>
        </div>
        <button 
          onClick={generateNewAtmosphere}
          disabled={isGenerating}
          className="flex items-center gap-4 bg-primary text-on-primary px-10 py-5 rounded-[2rem] font-sans font-bold text-sm tracking-widest uppercase hover:shadow-2xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group whitespace-nowrap"
        >
          {isGenerating ? (
            <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                    <motion.div 
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                ))}
            </div>
          ) : (
            <>
               <Sparkles size={18} className="group-hover:rotate-12 transition-transform" /> Generate Atmosphere
            </>
          )}
        </button>
      </header>

      {/* Archive Section */}
      <section className="space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
             <div className="w-1 h-8 bg-primary rounded-full"></div>
             <h2 className="font-display text-4xl font-bold italic tracking-tight">The Archive.</h2>
          </div>
          
          <div className="relative w-full max-w-md">
            <div className="flex items-center bg-surface-container rounded-2xl border border-outline/10 focus-within:border-primary/40 transition-colors p-1">
              <Search size={18} className="ml-4 text-on-surface-variant/40" />
              <input 
                type="text" 
                placeholder="Log a shadow..." 
                className="bg-transparent border-none focus:ring-0 w-full font-sans text-sm p-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                className="bg-surface-dim font-sans text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-all"
              >
                Find
              </button>
            </div>

            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-full mt-4 bg-white/80 backdrop-blur-3xl rounded-3xl border border-outline/10 shadow-2xl z-50 overflow-hidden p-4 space-y-2"
                >
                  {searchResults.map((movie) => (
                    <button 
                      key={movie.id}
                      onClick={() => setShowLogModal(movie)}
                      className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="w-12 h-18 bg-surface-dim rounded-lg overflow-hidden shrink-0 shadow-md">
                         <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-bold truncate group-hover:text-primary transition-colors">{movie.title}</p>
                        <p className="font-sans text-[10px] opacity-40 uppercase tracking-widest">{movie.release_date?.split('-')[0]}</p>
                      </div>
                      <Plus size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {logs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {logs.map((log) => (
              <motion.div 
                layout
                key={log.id}
                className="group relative h-[380px] rounded-[2.5rem] overflow-hidden border border-outline/10 hover:shadow-2xl transition-all hover:scale-[1.02]"
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w500${log.posterPath}`} 
                  alt={log.title} 
                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-primary">
                        <div className="flex gap-1 text-xs">
                          {Array.from({ length: log.rating }).map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                        </div>
                        <span className="font-mono text-[8px] uppercase tracking-widest">{new Date(log.date).getFullYear()}</span>
                      </div>
                      <h3 className="font-display text-2xl font-bold italic text-white line-clamp-2 leading-none">{log.title}</h3>
                      <p className="font-sans text-[10px] text-white/60 italic line-clamp-2">"{log.note}"</p>
                      <button 
                        onClick={() => deleteLog(log.id)}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-error/20 hover:text-error transition-all"
                      >
                         <Trash2 size={14} />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-outline/10 rounded-[3rem]">
             <Film size={48} className="text-on-surface-variant/20" />
             <p className="font-display text-2xl text-on-surface-variant/40 italic">The journal is empty. Echo a film you've seen.</p>
          </div>
        )}
      </section>

      {/* Atmospheric Gallery */}
      <section className="space-y-16">
        <div className="flex items-center gap-4">
           <div className="w-1 h-8 bg-primary rounded-full"></div>
           <h2 className="font-display text-4xl font-bold italic tracking-tight">Textures.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {scenes.map((scene) => (
            <motion.div
              layout
              key={scene.id}
              onClick={() => setSelectedScene(scene)}
              className="group relative h-[450px] bg-surface-container rounded-[3rem] overflow-hidden cursor-pointer border border-outline/10 hover:border-primary/40 transition-colors"
            >
              <img 
                src={scene.url} 
                alt={scene.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 md:p-12 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500">
                 <div className="space-y-6">
                    <div className="space-y-1">
                      <span className="font-sans text-[10px] font-bold text-primary tracking-[0.3em] uppercase block mb-1">{scene.intensity} Intensity</span>
                      <h3 className="font-display text-4xl md:text-5xl font-bold italic text-white leading-none tracking-tight">{scene.title}</h3>
                    </div>
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
                       <div className="flex gap-2">
                          <button className="bg-white/10 backdrop-blur-md text-white w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/20 transition-all">
                             <Play size={18} fill="currentColor" />
                          </button>
                          <button className="bg-white/10 backdrop-blur-md text-white w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/20 transition-all">
                             <Maximize2 size={18} />
                          </button>
                       </div>
                       <button className="bg-white text-black px-8 py-4 rounded-xl font-sans font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-lg">
                          Enter Space
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Log Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 pb-20 md:p-12 bg-black/40 backdrop-blur-xl">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-white max-w-4xl w-full rounded-[4rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[80vh]"
             >
                <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                   <img src={`https://image.tmdb.org/t/p/w500${showLogModal.poster_path}`} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 p-12 space-y-8 overflow-y-auto">
                   <div className="flex justify-between items-start">
                     <div className="space-y-2">
                       <h3 className="font-display text-4xl font-bold italic tracking-tight leading-none">{showLogModal.title}</h3>
                       <p className="font-sans text-[10px] font-black uppercase tracking-widest opacity-40">{showLogModal.release_date?.split('-')[0]}</p>
                     </div>
                     <button onClick={() => setShowLogModal(null)} className="text-on-surface-variant/20 hover:text-on-surface-variant transition-colors"><Maximize2 className="rotate-45" /></button>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="font-sans text-[10px] font-black uppercase tracking-widest opacity-30">Reflection Rating</label>
                        <div className="flex gap-4">
                           {[1, 2, 3, 4, 5].map((s) => (
                             <button key={s} className="hover:scale-125 transition-transform text-primary"><Star size={24} /></button>
                           ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="font-sans text-[10px] font-black uppercase tracking-widest opacity-30">Mental Note</label>
                        <textarea 
                          placeholder="How did this shadow move you?" 
                          className="w-full bg-surface-container rounded-2xl p-6 font-sans text-sm border-none focus:ring-primary focus:ring-1 h-32 resize-none"
                          id="log-note"
                        />
                      </div>
                   </div>

                   <button 
                     onClick={() => {
                        const note = (document.getElementById('log-note') as HTMLTextAreaElement).value;
                        saveLog({
                          id: Date.now().toString(),
                          tmdbId: showLogModal.id,
                          title: showLogModal.title,
                          posterPath: showLogModal.poster_path,
                          rating: 5, // Simplified for demo
                          note,
                          date: new Date().toISOString(),
                          mood: 'cinematic'
                        });
                     }}
                     className="w-full bg-primary text-on-primary px-10 py-5 rounded-3xl font-sans font-bold text-xs tracking-widest uppercase hover:shadow-2xl shadow-primary/30 transition-all"
                   >
                      Seal the memory
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedScene && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black p-8 md:p-20 flex flex-col items-center justify-center"
          >
            <button 
              onClick={() => setSelectedScene(null)}
              className="absolute top-12 right-12 text-white/40 hover:text-white transition-colors z-[210]"
            >
              <Maximize2 size={32} className="rotate-45" />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full h-full rounded-[4rem] overflow-hidden shadow-2xl relative"
            >
               <img 
                 src={selectedScene.url} 
                 alt={selectedScene.title}
                 className="w-full h-full object-cover"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-8">
                  <div className="max-w-4xl space-y-12">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4], y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="flex justify-center"
                    >
                      <Film size={80} className="text-white opacity-20" />
                    </motion.div>
                    
                    <div className="space-y-4">
                      <h2 className="font-display text-7xl md:text-9xl font-bold italic text-white tracking-tighter leading-none">{selectedScene.title}</h2>
                      <p className="font-display text-xl md:text-3xl text-white/50 italic max-w-2xl mx-auto leading-relaxed">Breathe with the image. Let world details fade into the background of your focus.</p>
                    </div>

                    <button 
                      onClick={() => setSelectedScene(null)}
                      className="bg-white text-black px-12 py-6 rounded-[2rem] font-sans font-bold text-xs md:text-sm uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all shadow-2xl"
                    >
                      Return to Reality
                    </button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
