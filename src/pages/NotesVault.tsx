import { useState, useEffect } from 'react';
import { Inbox, Search, Plus, Filter, Tag, FileText, ChevronRight, Bookmark, Archive, MoreVertical, BookOpen, Coffee, Feather, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';
import { subscribeToCollection, createThought, updateThought } from '../services/firebaseService';

interface Thought {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  category: string;
  wordCount: number;
  date?: string; // For display compatibility
  createdAt?: any;
}

const collections = [
  { name: 'All Thoughts', count: 1254, icon: Inbox },
  { name: 'Philosophy', count: 42, icon: BookOpen },
  { name: 'Engineering', count: 156, icon: Feather },
  { name: 'Creative Strategy', count: 89, icon: Coffee },
  { name: 'Personal Log', count: 967, icon: FileText },
];

export default function Library() {
  const { user } = useUser();
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingThought, setEditingThought] = useState<Partial<Thought>>({});

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToCollection('thoughts', (data) => {
        setThoughts(data as Thought[]);
      });
      return () => unsubscribe();
    } else {
      setThoughts([]);
    }
  }, [user]);

  const filteredThoughts = thoughts.filter(t => 
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveThought = async () => {
    if (!editingThought.title) return;

    if (editingThought.id) {
      await updateThought(editingThought.id, editingThought);
    } else {
      await createThought({
        ...editingThought,
        summary: editingThought.content?.slice(0, 150) + '...',
        wordCount: editingThought.content?.split(/\s+/).length || 0,
        tags: ['Draft'],
        category: 'Personal Log'
      });
    }

    setIsEditorOpen(false);
    setEditingThought({});
  };

  const openEditor = (thought?: Thought) => {
    setEditingThought(thought || { title: '', content: '' });
    setIsEditorOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[calc(100vh-64px-32px)] overflow-hidden"
    >
      {/* Sidebar Navigation */}
      <aside className="w-96 bg-surface-container-low border-r border-outline/10 flex flex-col pt-12">
        <div className="px-10 mb-12">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary opacity-30 group-focus-within:opacity-100 transition-opacity" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..." 
              className="w-full bg-white rounded-xl py-5 pl-16 pr-6 text-sm font-sans font-medium placeholder:italic border border-outline/5 focus:border-primary/20 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          <p className="px-4 font-sans text-[10px] uppercase font-bold text-primary tracking-[0.3em] opacity-40 mb-4">Collections</p>
          {collections.map((col, i) => (
            <button key={i} className="w-full flex items-center justify-between py-4 px-4 rounded-xl hover:bg-white transition-all group hover:shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent group-hover:bg-primary/5 transition-colors">
                  <col.icon size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                </div>
                <span className="font-display text-lg font-bold italic group-hover:text-primary transition-colors">{col.name}</span>
              </div>
              <span className="font-mono text-[10px] text-on-surface-variant opacity-20 group-hover:opacity-100">{col.count}</span>
            </button>
          ))}
        </nav>

        <div className="p-10 border-t border-outline/10 space-y-8 bg-surface-dim">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] font-black text-primary opacity-40">Threads</p>
          <div className="flex flex-wrap gap-2">
            {['Deep Work', 'Research', 'Draft', 'Final', 'Archived'].map(f => (
              <span key={f} className="font-sans text-[10px] font-bold bg-white border border-outline/10 px-4 py-2 rounded-lg uppercase cursor-pointer hover:bg-primary hover:text-on-primary transition-all tracking-widest">
                {f}
              </span>
            ))}
          </div>
          <button className="w-full mt-6 py-4 rounded-xl border-2 border-dashed border-outline/20 text-on-surface-variant/40 font-sans text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
            <Filter size={14} className="inline mr-3 -mt-1" /> Advanced Query
          </button>
        </div>
      </aside>

      {/* Main Content: Notes List */}
      <div className="flex-1 bg-white overflow-y-auto custom-scrollbar relative">
        <div className="px-16 py-12 border-b border-outline/5 sticky top-0 z-10 flex justify-between items-end bg-white/95 backdrop-blur-xl shadow-sm">
            <div className="space-y-2">
                <h3 className="font-display text-5xl font-bold tracking-tight italic">The Library.</h3>
                <p className="font-display text-sm italic text-on-surface-variant opacity-60">The weight of words / Synthesizing your story.</p>
            </div>
            <div className="flex gap-4">
                <button 
                  onClick={() => openEditor()}
                  className="flex items-center gap-4 px-10 py-4 bg-primary text-on-primary rounded-xl font-sans font-black text-[10px] uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                >
                    <Plus size={18} /> New Entry
                </button>
            </div>
        </div>

        <div className="divide-y divide-outline/5">
          {filteredThoughts.map((note) => (
            <div 
              key={note.id} 
              onClick={() => openEditor(note)}
              className="p-16 hover:bg-primary/[0.01] transition-all cursor-pointer group relative"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-6">
                  <span className="font-sans text-[10px] text-primary font-bold tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity uppercase">Volume #{note.id.slice(-4).toUpperCase()}</span>
                  <div className="w-[1px] h-3 bg-outline/20"></div>
                  <span className="font-sans text-[10px] text-on-surface-variant font-bold tracking-widest opacity-40 uppercase italic">
                    {note.createdAt?.toDate().toLocaleDateString() || 'Today'}
                  </span>
                </div>
                <div className="flex gap-6 opacity-0 group-hover:opacity-40 transition-all group-hover:translate-x-0 translate-x-4">
                    <button className="hover:text-primary transition-colors"><Bookmark size={20} /></button>
                    <button className="hover:text-primary transition-colors"><Archive size={20} /></button>
                    <button className="hover:text-primary transition-colors"><MoreVertical size={20} /></button>
                </div>
              </div>

              <div className="flex justify-between items-end gap-20">
                <div className="flex-1 space-y-6">
                  <h4 className="font-display text-4xl font-bold text-on-background group-hover:text-primary transition-colors italic tracking-tight leading-none">{note.title}</h4>
                  <p className="font-display text-xl text-on-surface-variant leading-relaxed italic opacity-60 line-clamp-2 max-w-3xl">
                    "{note.summary}"
                  </p>
                  <div className="flex gap-3 pt-2">
                    {note.tags?.map(tag => (
                      <span key={tag} className="font-sans text-[10px] font-bold bg-surface-dim border border-outline/10 px-4 py-2 rounded-lg uppercase flex items-center gap-3 tracking-widest group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                        <Tag size={12} className="opacity-40" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-6 shrink-0">
                    <span className="font-mono text-[10px] font-bold text-primary opacity-40">{note.wordCount || 0} WORDS</span>
                    <div className="w-16 h-16 rounded-full border border-outline/20 flex items-center justify-center text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-all duration-500 shadow-sm group-hover:scale-110">
                        <ChevronRight size={28} strokeWidth={1.5} />
                    </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredThoughts.length === 0 && (
            <div className="p-32 text-center space-y-4 opacity-40">
              <FileText size={64} className="mx-auto text-primary opacity-20" />
              <p className="font-display text-2xl italic">The archives are silent.</p>
              <button 
                onClick={() => openEditor()}
                className="text-primary font-sans text-xs font-bold uppercase tracking-widest border-b border-primary/20 pb-1"
              >
                Capture your first thought
              </button>
            </div>
          )}
        </div>
        
        <div className="p-24 text-center bg-surface-dim border-t border-outline/5 mt-12">
            <button className="font-sans text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40 hover:text-primary transition-all px-12 py-4 border border-outline/10 rounded-full hover:bg-white hover:shadow-sm">Load earlier volumes</button>
        </div>

        {/* Floating Editor Overlay */}
        <AnimatePresence>
          {isEditorOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-50 flex flex-col"
            >
              <div className="px-16 py-12 border-b border-outline/5 flex justify-between items-center bg-white/95 backdrop-blur-xl sticky top-0">
                 <button 
                  onClick={() => setIsEditorOpen(false)}
                  className="w-12 h-12 rounded-full border border-outline/10 flex items-center justify-center hover:bg-surface-dim transition-colors"
                 >
                    <X size={20} />
                 </button>
                 <div className="flex gap-4">
                    <button 
                      onClick={handleSaveThought}
                      className="bg-primary text-on-primary px-10 py-4 rounded-xl font-sans font-black text-[10px] uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                    >
                      Archive Thought
                    </button>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto px-16 py-24 max-w-4xl mx-auto w-full space-y-12">
                <input 
                  type="text"
                  autoFocus
                  value={editingThought.title || ''}
                  onChange={(e) => setEditingThought(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="The Title of Your Thought..."
                  className="w-full bg-transparent border-none font-display text-6xl font-bold tracking-tight italic outline-none placeholder:text-outline/20"
                />
                <textarea 
                  value={editingThought.content || ''}
                  onChange={(e) => setEditingThought(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Begin your exploration here..."
                  className="w-full flex-1 bg-transparent border-none font-display text-2xl leading-relaxed italic outline-none placeholder:text-outline/20 min-h-[50vh] resize-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
