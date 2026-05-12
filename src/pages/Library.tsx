import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLoomStore, Fragment } from '../hooks/useLoomStore';
import { Search, PenLine, Quote, Camera, Mic, Film, Music, Plus, Edit2, X } from 'lucide-react';

export default function Library() {
  const { data, deleteFragment, updateFragment, addCategory } = useLoomStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState('cat-all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFragmentId, setExpandedFragmentId] = useState<string | null>(null);

  const selectedCategoryName = data.categories.find(c => c.id === selectedCategoryId)?.name || 'All Thoughts';

  const filteredFragments = useMemo(() => {
    return data.fragments.filter(f => {
      const matchesCategory = selectedCategoryId === 'cat-all' || f.category === selectedCategoryName;
      const matchesSearch = f.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [data.fragments, selectedCategoryId, selectedCategoryName, searchQuery]);

  const activeCategories = useMemo(() => {
    return data.categories.filter(cat => {
      if (cat.id === 'cat-all') return true;
      return data.fragments.some(f => f.category === cat.name);
    });
  }, [data.categories, data.fragments]);

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDayIntention = (dayId: string) => {
    const day = data.days.find(d => d.id === dayId);
    return day?.intention;
  };

  const expandedFragment = data.fragments.find(f => f.id === expandedFragmentId);

  return (
    <div className="flex h-screen overflow-hidden pt-12">
      {/* Category Rail */}
      <aside className="w-64 border-r border-cream-200/50 p-12 overflow-y-auto bg-cream-50">
        <div className="space-y-12">
          <div className="space-y-6">
            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`flex justify-between items-center w-full group transition-all text-left ${
                  selectedCategoryId === cat.id ? 'text-ink-900 border-l-2 border-sage-500 pl-4' : 'text-ink-400 pl-4 hover:text-ink-700'
                }`}
              >
                <span className="font-serif text-xl italic">{cat.name.toLowerCase()}</span>
                <span className="meta-text text-[8px] opacity-40">
                  {data.fragments.filter(f => cat.id === 'cat-all' || f.category === cat.name).length}
                </span>
              </button>
            ))}
            <button 
              onClick={() => {
                const name = prompt('New category name:');
                if (name) addCategory(name);
              }}
              className="text-ink-400 hover:text-sage-500 transition-all pl-4"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-cream-50 overflow-hidden">
        <div className="p-12 space-y-12 overflow-y-auto">
          <div className="space-y-2">
            <h1 className="text-4xl">library.</h1>
            <p className="italic text-ink-400">"Everything you have said to yourself."</p>
          </div>

          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink-400 opacity-20 group-focus-within:opacity-100 transition-opacity" size={20} />
            <input 
              type="text" 
              placeholder="Search the library..."
              className="w-full bg-cream-100 border border-cream-200/50 rounded-full py-4 pl-16 pr-8 text-xl font-serif italic focus:ring-1 focus:ring-sage-500 outline-none placeholder:opacity-20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredFragments.length > 0 ? (
                filteredFragments.map((fragment) => (
                  <motion.div 
                    key={fragment.id}
                    layoutId={fragment.id}
                    onClick={() => setExpandedFragmentId(fragment.id)}
                    className="loom-card p-8 space-y-4 hover:shadow-xl transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                       <span className="meta-text text-[8px] opacity-60 italic">{formatDateShort(fragment.dayId)}</span>
                       <div className="text-ink-400">
                          {fragment.type === 'thought' && <PenLine size={14} />}
                          {fragment.type === 'quote' && <Quote size={14} />}
                          {fragment.type === 'song' && <Music size={14} />}
                       </div>
                    </div>
                    <p className={`text-lg leading-relaxed line-clamp-4 ${fragment.type === 'quote' ? 'italic text-center' : ''}`}>
                      {fragment.content}
                    </p>
                    <div className="space-y-1 pt-2">
                       {getDayIntention(fragment.dayId) && (
                         <p className="text-[10px] italic text-ink-400 leading-tight">*"Intention: {getDayIntention(fragment.dayId)}"*</p>
                       )}
                       <span className="meta-text text-[8px] border border-cream-200 rounded-full px-2 py-0.5 inline-block opacity-40">
                         {fragment.category}
                       </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-32 text-center">
                   <p className="text-ink-400 italic opacity-40">"The shelves are open. Capture begins on Today."</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Reading View Modal */}
      <AnimatePresence>
        {expandedFragmentId && expandedFragment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/10 backdrop-blur-sm">
            <motion.div 
              layoutId={expandedFragmentId}
              className="w-full max-w-2xl bg-cream-50 rounded-[12px] p-16 space-y-12 relative shadow-2xl"
            >
              <button 
                onClick={() => setExpandedFragmentId(null)}
                className="absolute top-8 right-8 text-ink-400 hover:text-ink-900 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="space-y-2 text-center">
                 <p className="meta-text italic">*{formatDateShort(expandedFragment.dayId)}*</p>
                 {getDayIntention(expandedFragment.dayId) && (
                    <p className="text-sm italic text-ink-400">*"Intention for this day: {getDayIntention(expandedFragment.dayId)}"*</p>
                 )}
              </div>

              <div className="space-y-8">
                 <p className={`text-2xl leading-relaxed ${expandedFragment.type === 'quote' ? 'italic text-center text-3xl' : ''}`}>
                    {expandedFragment.content}
                 </p>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-cream-200">
                 <div className="flex gap-4">
                    <button className="text-ink-400 hover:text-ink-900 transition-colors flex items-center gap-2 text-sm italic">
                       <Edit2 size={14} /> edit
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Delete this fragment forever?')) {
                          deleteFragment(expandedFragment.id);
                          setExpandedFragmentId(null);
                        }
                      }}
                      className="text-ink-400 hover:text-red-500 transition-colors flex items-center gap-2 text-sm italic"
                    >
                       <Trash2 size={14} /> delete
                    </button>
                 </div>
                 <span className="meta-text bg-cream-100 rounded-px px-4 py-1">
                    {expandedFragment.category}
                 </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Trash2({ size, className }: { size?: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}
