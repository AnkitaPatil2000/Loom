import { useState, useEffect } from 'react';
import { Heart, Plus, MessageSquare, BookOpen, Star, RefreshCw, Feather, Smile, Wind, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useUser } from '../context/UserContext';
import { subscribeToCollection, createThought, logFocusSession } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { user, profile } = useUser();
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  
  const [tasks, setTasks] = useState<any[]>([]);
  const [thoughts, setThoughts] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [gardenAreas, setGardenAreas] = useState<any[]>([]);
  const [quickThought, setQuickThought] = useState('');

  useEffect(() => {
    if (user) {
      const unsubTasks = subscribeToCollection('tasks', (data) => setTasks(data.slice(0, 3)));
      const unsubThoughts = subscribeToCollection('thoughts', (data) => setThoughts(data.slice(0, 3)));
      const unsubSessions = subscribeToCollection('focus_sessions', (data) => setSessions(data.slice(0, 3)));
      const unsubGrowth = subscribeToCollection('growth_areas', (data) => setGardenAreas(data.slice(0, 3)));
      
      return () => {
        unsubTasks();
        unsubThoughts();
        unsubSessions();
        unsubGrowth();
      }
    }
  }, [user]);

  const handleQuickThought = async () => {
    if (!quickThought.trim()) return;
    await createThought({
      title: quickThought.slice(0, 40) + (quickThought.length > 40 ? '...' : ''),
      content: quickThought,
      summary: quickThought.slice(0, 100) + '...',
      tags: ['Whisper'],
      category: 'Personal Log'
    });
    setQuickThought('');
  };

  const activeTask = tasks.find(t => t.status !== 'completed');
  const totalFocus = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-16 max-w-7xl mx-auto space-y-16"
    >
      {/* Header section */}
      <div className="flex justify-between items-end mb-24">
        <div className="space-y-4">
          <p className="font-sans text-xs text-primary font-semibold tracking-widest uppercase opacity-60">Good morning / {today}</p>
          <h3 className="font-display text-7xl font-bold tracking-tight text-on-background">
            Build a life that feels like yours.
          </h3>
          <p className="font-display text-2xl italic text-on-surface-variant max-w-2xl leading-relaxed">
            Take a breath. Your days are composed of moments, not just tasks. What will you loom together today?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Main Focus: Today's Space */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-[2rem] p-12 relative overflow-hidden group border border-outline/30 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-700">
          <div className="absolute -top-12 -right-12 p-16 opacity-[0.03] group-hover:opacity-[0.06] transition-all duration-1000 rotate-12">
            <Wind size={400} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[400px]">
             <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="font-sans text-[10px] font-bold text-primary tracking-[0.2em] uppercase">In Focus Today</span>
                  <h4 className="font-display text-4xl font-bold italic text-on-background">
                    {activeTask ? activeTask.title : "Waiting for your first intention."}
                  </h4>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg shadow-black/5 hover:scale-110 transition-transform cursor-pointer">
                  <Star size={20} className="text-secondary" fill="currentColor" />
                </div>
             </div>

             <div className="my-16 space-y-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-9xl font-bold tracking-tighter text-on-background tabular-nums">
                    {Math.floor(totalFocus / 3600).toString().padStart(2, '0')}
                  </span>
                  <span className="font-display text-4xl italic text-on-surface-variant">hours deep into exploration.</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => navigate('/focus')}
                    className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-sans font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                  >
                    Start Focusing
                  </button>
                  <button 
                    onClick={() => navigate('/intentions')}
                    className="px-8 py-4 bg-white text-on-background border border-outline rounded-2xl font-sans font-semibold text-sm hover:bg-surface-dim transition-all"
                  >
                    Set Intentions
                  </button>
                </div>
             </div>

             <div className="pt-8 border-t border-outline/30">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-sans text-xs font-semibold text-on-surface-variant opacity-60 italic">Your rhythm today</span>
                  <span className="font-sans text-xs font-bold text-primary tracking-widest uppercase">75% of your pace reached</span>
                </div>
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                   <div className="h-full bg-primary/40 w-3/4 rounded-full transition-all duration-1000"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar: Weekly Rhythm */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-10">
          <div className="bg-surface-container-high rounded-[2rem] p-10 flex flex-col justify-between flex-1 border border-outline/30 relative overflow-hidden group">
            <div className="absolute top-4 right-4 opacity-10">
              <RefreshCw size={100} className="group-hover:rotate-180 transition-transform duration-1000" />
            </div>
            <div className="space-y-6">
              <span className="font-sans text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Weekly Rhythm</span>
              <div className="flex items-end justify-between h-40 gap-3">
                {[0.4, 0.85, 0.6, 0.95, 0.7, 0.9, 0.2].map((height, i) => (
                  <div key={i} className="flex-1 space-y-3 flex flex-col items-center group/bar">
                     <div 
                      className={`w-full rounded-t-xl transition-all duration-700 ${height > 0.6 ? 'bg-primary' : 'bg-outline'} group-hover/bar:scale-x-110`}
                      style={{ height: `${height * 100}%` }}
                    ></div>
                    <span className="font-mono text-[8px] opacity-40">0{i+1}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-10 space-y-4">
               <div className="flex justify-between items-end">
                  <span className="font-sans text-xs font-medium text-on-surface-variant opacity-60">Successive days</span>
                  <span className="font-display text-4xl font-bold italic text-primary">{profile?.rhythmStreak || 0} days.</span>
               </div>
               <div className="h-1 w-full bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-primary/40 w-full animate-pulse"></div>
               </div>
            </div>
          </div>

          <div className="bg-secondary-container rounded-[2rem] p-10 flex flex-col justify-between border border-secondary/10 hover:shadow-xl hover:shadow-secondary/5 transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                <Heart size={20} fill="currentColor" />
              </div>
              <p className="font-display text-xl leading-snug italic font-medium text-on-secondary-container">
                "Growth is a slow unfolding, not a race to be won."
              </p>
            </div>
            <div className="mt-8 flex justify-between items-center opacity-60">
              <span className="font-sans text-[10px] uppercase font-bold tracking-widest">Entry #402</span>
              <Feather size={14} />
            </div>
          </div>
        </div>

        {/* Growth Areas placeholder - making it real involves skills tracking which we'll handle next */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container rounded-[2rem] p-12 border border-outline/20 space-y-10">
          <div className="flex justify-between items-center">
            <h5 className="font-display text-2xl font-bold italic">Areas of Growth.</h5>
            <button onClick={() => navigate('/skills')} className="text-primary p-2 hover:bg-primary/5 rounded-full transition-all">
              <Plus size={20} />
            </button>
          </div>
          <div className="space-y-8">
            {gardenAreas.length > 0 ? gardenAreas.map((area, i) => (
              <div key={i} onClick={() => navigate('/skills')} className="group cursor-pointer space-y-4">
                <div className="flex justify-between items-end">
                  <span className="font-sans text-sm font-semibold tracking-tight text-on-surface-variant group-hover:text-primary transition-colors">{area.name}</span>
                  <span className="font-mono text-[10px] opacity-40">Lv.{area.level} • {area.growthProgress}%</span>
                </div>
                <div className="h-1 w-full bg-white rounded-full overflow-hidden">
                  <div className={`h-full bg-primary transition-all duration-1000`} style={{ width: `${area.growthProgress}%` }}></div>
                </div>
              </div>
            )) : (
              [
                { label: 'Creative Direction', progress: 40, color: 'bg-primary' },
                { label: 'Quiet Reflection', progress: 20, color: 'bg-secondary' },
                { label: 'Technical Craft', progress: 30, color: 'bg-primary' },
              ].map((area, i) => (
                <div key={i} className="group cursor-pointer space-y-4 opacity-40">
                  <div className="flex justify-between items-end">
                    <span className="font-sans text-sm font-semibold tracking-tight text-on-surface-variant">{area.label}</span>
                    <span className="font-mono text-[10px]">{area.progress}%</span>
                  </div>
                  <div className="h-1 w-full bg-white rounded-full overflow-hidden">
                    <div className={`h-full ${area.color} transition-all duration-1000`} style={{ width: `${area.progress}%` }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Captured Thoughts */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-[2rem] p-12 border border-outline/10 shadow-sm focus-within:shadow-xl focus-within:shadow-primary/5 transition-all">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                <MessageSquare size={18} />
             </div>
             <h5 className="font-display text-2xl font-bold italic">Whispers in wait.</h5>
          </div>
          
          <textarea 
            value={quickThought}
            onChange={(e) => setQuickThought(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 font-sans p-0 resize-none h-40 placeholder:italic text-lg text-on-background focus:outline-none placeholder:opacity-30 leading-relaxed" 
            placeholder="A place for your thoughts, goals, and growth. Capture the essence of this moment..."
          ></textarea>
          
          <div className="flex justify-between items-center mt-8 pt-8 border-t border-outline/20">
            <div className="flex gap-4">
               <button className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                  <Smile size={20} />
               </button>
               <button onClick={() => navigate('/library')} className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                  <BookOpen size={20} />
               </button>
            </div>
            <button 
              onClick={handleQuickThought}
              className="bg-primary/10 text-primary font-sans font-bold text-xs uppercase px-12 py-4 rounded-xl hover:bg-primary hover:text-on-primary transition-all shadow-sm"
            >
              Keep Thought
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
