import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, MoreHorizontal, Plus, AlertCircle, ChevronLeft, ChevronRight, ListTodo, Wind, Star, Sun, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import { subscribeToCollection, createTask, updateTask, deleteTask } from '../services/firebaseService';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  category: string;
  priority: 'Low' | 'Medium' | 'High';
}

const seasonArc = [
  { title: 'Emotional Resonance', progress: 85 },
  { title: 'Space Harmony', progress: 42 },
  { title: 'Creative Flux', progress: 68 },
];

export default function Intentions() {
  const { user, signIn } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('General');

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToCollection('tasks', (data) => {
        setTasks(data as Task[]);
      });
      return () => unsubscribe();
    } else {
      setTasks([]);
    }
  }, [user]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await createTask({
      title: newTaskTitle,
      category: newTaskCategory,
      status: 'pending',
      priority: 'Medium'
    });

    setNewTaskTitle('');
    setIsAdding(false);
  };

  const toggleTask = async (task: Task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { status: nextStatus });
  };

  const removeTask = async (id: string) => {
    await deleteTask(id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-16 max-w-7xl mx-auto space-y-24"
    >
      {!user && (
        <div className="bg-primary/5 rounded-[2rem] p-12 border border-primary/20 text-center space-y-6">
          <h4 className="font-display text-3xl font-bold italic">Connect to save your intentions.</h4>
          <p className="font-sans text-sm text-on-surface-variant opacity-60">Your path is unique. Sign in to persist your progress across the seasons.</p>
          <button 
            onClick={() => signIn()}
            className="bg-primary text-on-primary px-12 py-4 rounded-2xl font-sans font-black text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
          >
            Start Your Journey
          </button>
        </div>
      )}

      {/* Header section */}
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-4">
          <p className="font-sans text-[10px] text-primary uppercase font-bold tracking-[0.3em] opacity-60">The Flow of Time / {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
          <h3 className="font-display text-7xl font-bold tracking-tight italic">Shape your weeks.</h3>
        </div>
        <div className="flex gap-6">
            <div className="flex bg-white rounded-2xl overflow-hidden shadow-sm border border-outline/10">
                <button className="p-4 hover:bg-primary/5 transition-colors border-r border-outline/10 text-primary"><ChevronLeft size={18} /></button>
                <div className="px-8 flex items-center font-display text-sm font-bold italic text-on-surface-variant">Week 26</div>
                <button className="p-4 hover:bg-primary/5 transition-colors border-l border-outline/10 text-primary"><ChevronRight size={18} /></button>
            </div>
            <button 
                onClick={() => setIsAdding(true)}
                className="bg-primary text-on-primary font-sans font-black text-[10px] uppercase px-12 py-4 rounded-2xl hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center gap-4 tracking-[0.2em] active:scale-95"
            >
                <Plus size={16} /> New Venture
            </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* Weekly Task Ledger */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
            <section className="bg-white rounded-[2rem] border border-outline/10 overflow-hidden shadow-sm">
                <div className="p-10 border-b border-outline/10 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <ListTodo size={24} className="text-primary" />
                        <h4 className="font-display text-3xl font-bold italic">Daily Intentions.</h4>
                    </div>
                </div>
                
                <div className="divide-y divide-outline/10 px-4">
                    <AnimatePresence mode="popLayout">
                        {isAdding && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="p-10 bg-primary/[0.03] rounded-2xl m-2"
                            >
                                <form onSubmit={handleAddTask} className="space-y-6">
                                    <input 
                                        autoFocus
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        placeholder="What is your next focus?"
                                        className="w-full bg-transparent border-none font-display text-3xl font-bold italic outline-none placeholder:text-outline/40"
                                    />
                                    <div className="flex justify-between items-center">
                                        <select 
                                            value={newTaskCategory}
                                            onChange={(e) => setNewTaskCategory(e.target.value)}
                                            className="bg-white border border-outline/10 rounded-xl px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-widest text-primary outline-none"
                                        >
                                            <option>General</option>
                                            <option>Creative</option>
                                            <option>Growth</option>
                                            <option>Architecture</option>
                                            <option>Thinking</option>
                                        </select>
                                        <div className="flex gap-4">
                                            <button 
                                                type="button"
                                                onClick={() => setIsAdding(false)}
                                                className="px-6 py-2 rounded-xl font-sans text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-40 hover:opacity-100 transition-opacity"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit"
                                                className="bg-primary text-on-primary px-8 py-2 rounded-xl font-sans text-[10px] font-bold uppercase tracking-widest hover:shadow-lg transition-all"
                                            >
                                                Commit
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {tasks.map((item) => (
                        <motion.div 
                            layout
                            key={item.id} 
                            className="p-10 hover:bg-primary/[0.01] transition-all flex items-center justify-between group cursor-pointer rounded-2xl m-2"
                        >
                            <div className="flex items-center gap-8" onClick={() => toggleTask(item)}>
                                {item.status === 'completed' ? (
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
                                        <CheckCircle2 size={24} />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-surface-dim border-2 border-outline/20 flex items-center justify-center group-hover:border-primary transition-colors">
                                        <Circle size={24} className="text-outline/20 group-hover:text-primary transition-colors" />
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <h5 className={`font-display text-2xl font-bold transition-all ${item.status === 'completed' ? 'line-through opacity-30 italic' : 'text-on-background group-hover:text-primary'}`}>
                                        {item.title}
                                    </h5>
                                    <div className="flex items-center gap-4">
                                        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-primary font-bold">{item.category}</span>
                                        <div className="w-[1px] h-3 bg-outline/20"></div>
                                        <span className={`font-sans text-[10px] uppercase tracking-[0.2em] font-black ${item.priority === 'High' ? 'text-secondary' : 'text-on-surface-variant opacity-40'}`}>
                                            {item.priority}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 opacity-0 group-hover:opacity-40 transition-all translate-x-4 group-hover:translate-x-0 text-on-surface-variant">
                                <button onClick={() => removeTask(item.id)} className="hover:text-error transition-colors">
                                    <Trash2 size={20} />
                                </button>
                                <button className="hover:text-primary transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {tasks.length === 0 && !isAdding && (
                        <div className="p-24 text-center space-y-4">
                            <Wind size={48} className="mx-auto text-primary opacity-20" />
                            <p className="font-display text-xl italic opacity-40 italic">Nothing on the radar yet. A clean slate for a fresh start.</p>
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full p-10 bg-surface-container font-sans text-xs font-black uppercase text-on-surface-variant/40 hover:text-primary transition-all tracking-[0.3em]"
                >
                   Begin a new thought.
                </button>
            </section>

            {/* Daily Grid Preview */}
            <div className="grid grid-cols-7 gap-4">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div key={day+i} className="bg-surface-container-low rounded-3xl p-8 min-h-[220px] relative transition-all group hover:bg-white border border-outline/10 hover:shadow-xl hover:shadow-primary/5 cursor-pointer">
                        <span className="font-sans text-xs font-black text-primary mb-6 block opacity-40 group-hover:opacity-100">{day}</span>
                        {i === 2 && tasks.some(t => t.status !== 'completed') && (
                            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 text-[11px] leading-relaxed italic text-on-surface-variant font-bold shadow-sm">
                                {tasks.find(t => t.status !== 'completed')?.title}
                            </div>
                        )}
                        <div className="absolute bottom-4 right-4 text-on-surface font-display text-4xl font-black opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none italic">
                            {i + 15}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Sidebar: Season Arc */}
        <div className="col-span-12 lg:col-span-4 space-y-12">
            <section className="bg-surface-container-high rounded-[2.5rem] p-12 relative overflow-hidden group border border-outline/10 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5">
                <div className="absolute -top-12 -right-12 p-16 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 rotate-12">
                    <Sun size={320} />
                </div>
                <h4 className="font-display text-3xl font-bold italic mb-12 relative z-10">The Season's Arc.</h4>
                <div className="space-y-12 relative z-10">
                    {seasonArc.map((goal, i) => (
                        <div key={i} className="space-y-4">
                            <div className="flex justify-between items-baseline">
                                <h5 className="font-sans text-[10px] font-black uppercase tracking-[0.2em] text-primary">{goal.title}</h5>
                                <span className="font-display text-2xl font-bold italic text-primary">{goal.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                                <div className="h-full bg-primary/40 transition-all duration-[2000ms] delay-500 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-16 pt-12 border-t border-outline/20 relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <span className="font-sans text-[10px] uppercase text-on-surface-variant font-bold tracking-[0.2em] opacity-40 italic">Season ends in</span>
                        <span className="font-display text-4xl font-black italic text-primary">06 days.</span>
                    </div>
                    <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                        <div className="h-full bg-secondary/40" style={{ width: '92%' }}></div>
                    </div>
                </div>
            </section>

            <section className="bg-secondary-container rounded-[2.5rem] p-12 relative overflow-hidden group border border-secondary/10">
                <div className="absolute -bottom-12 -left-12 opacity-[0.05] group-hover:rotate-12 transition-all duration-1000">
                     <Wind size={240} />
                </div>
                <div className="flex items-center gap-4 mb-8 relative z-10">
                   <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                      <Star size={20} fill="currentColor" />
                   </div>
                   <p className="font-sans text-[10px] uppercase tracking-[0.3em] font-black italic text-on-secondary-container opacity-60">Thought for the season</p>
                </div>
                <div className="font-display text-3xl italic leading-tight text-on-secondary-container font-medium relative z-10">
                    "Growth is not a race. It is a slow, steady expansion of your own horizon."
                </div>
                <div className="mt-12 flex justify-end relative z-10 transition-transform group-hover:translate-x-2">
                   <button className="text-secondary opacity-40 hover:opacity-100"><MoreHorizontal size={24} /></button>
                </div>
            </section>
        </div>
      </div>
    </motion.div>
  );
}
