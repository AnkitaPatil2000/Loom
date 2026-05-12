import { useState, useEffect } from 'react';
import { Moon, Sun, Cloud, Wind, Plus, History, Trash2, Edit3, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import { subscribeToCollection, logReflection } from '../services/firebaseService';

interface Reflection {
  id: string;
  content: string;
  mood: string;
  tags: string[];
  createdAt: any;
}

const moodIcons: Record<string, any> = {
  'Grateful': <Sun className="text-secondary" />,
  'Reflective': <Moon className="text-primary" />,
  'Dreamy': <Cloud className="text-primary opacity-60" />,
  'Energetic': <Plus className="text-secondary" />,
  'Quiet': <Wind className="text-primary opacity-40" />
};

export default function Journal() {
  const { user } = useUser();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('Reflective');

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToCollection('reflections', (data) => {
        setReflections(data as Reflection[]);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    await logReflection({
      content: newContent,
      mood: selectedMood,
      tags: ['Daily'],
      date: new Date()
    });

    setNewContent('');
    setIsAdding(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-8 py-12"
    >
      <header className="flex justify-between items-end mb-16">
        <div className="space-y-4">
           <span className="font-sans text-xs font-black text-primary tracking-[0.3em] uppercase opacity-40">The Inner Landscape</span>
           <h1 className="font-display text-7xl font-bold italic text-on-background tracking-tighter">Your Journal.</h1>
           <p className="font-display text-xl text-on-surface-variant italic opacity-60">Collecting the fragments of today's awareness.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-4 bg-primary text-on-primary px-8 py-4 rounded-2xl font-sans font-bold text-sm tracking-widest uppercase hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
        >
          <Edit3 size={18} /> New Entry
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-16 bg-white rounded-[3rem] p-12 border border-outline/10 shadow-2xl shadow-black/5"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  {Object.keys(moodIcons).map(mood => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setSelectedMood(mood)}
                      className={`p-4 rounded-2xl transition-all flex items-center gap-3 border ${
                        selectedMood === mood 
                          ? 'bg-primary/5 border-primary text-primary' 
                          : 'bg-surface-dim border-outline/10 text-on-surface-variant opacity-40 grayscale hover:grayscale-0'
                      }`}
                    >
                      {moodIcons[mood]}
                      <span className="font-sans text-[10px] font-bold uppercase tracking-widest">{mood}</span>
                    </button>
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="font-sans text-[10px] font-bold uppercase opacity-30 hover:opacity-100 transition-opacity"
                >
                  Discard
                </button>
              </div>

              <textarea 
                autoFocus
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 font-display text-2xl italic leading-relaxed text-on-background placeholder:opacity-20 outline-none h-48 resize-none"
                placeholder="What ripples did the day leave behind?"
              />

              <div className="flex justify-end">
                 <button 
                   type="submit"
                   className="bg-primary text-on-primary px-12 py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                 >
                   Preserve Moment
                 </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {reflections.map((entry) => (
          <motion.article 
            layout
            key={entry.id}
            className="bg-surface-container rounded-[2rem] p-12 border border-outline/10 group hover:border-primary/20 transition-colors"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {moodIcons[entry.mood] || <Moon size={20} className="text-primary" />}
                </div>
                <div>
                  <span className="font-mono text-[10px] opacity-40 uppercase tracking-widest block mb-1">
                    {entry.createdAt?.toDate().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                  <p className="font-display text-lg font-bold italic text-primary">{entry.mood}</p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                 <button className="p-3 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-xl transition-all">
                    <Trash2 size={16} />
                 </button>
                 <button className="p-3 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                    <Bookmark size={16} />
                 </button>
              </div>
            </div>
            
            <p className="font-display text-2xl italic leading-relaxed text-on-background/80 mb-8 whitespace-pre-wrap">
              "{entry.content}"
            </p>

            <div className="flex gap-2">
              {entry.tags?.map(tag => (
                <span key={tag} className="font-sans text-[10px] font-bold uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full opacity-40">
                  #{tag}
                </span>
              ))}
            </div>
          </motion.article>
        ))}

        {reflections.length === 0 && !isAdding && (
          <div className="p-32 text-center space-y-6 opacity-30">
            <History size={64} className="mx-auto text-primary opacity-20" />
            <p className="font-display text-2xl italic">The pages are waiting for the ink of your thoughts.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
